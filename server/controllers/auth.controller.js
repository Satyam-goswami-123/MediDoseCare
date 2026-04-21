const db = require('../config/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const otpStore = new Map(); // In-memory OTP store (use Redis in production)
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const otpKey = (channel, target) => `${channel}:${target}`;
const hashOtp = (channel, target, otp) =>
  crypto.createHash('sha256').update(`${channel}:${target}:${otp}`).digest('hex');
const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

let transporter;
const getTransporter = () => {
  if (transporter) return transporter;
  const {
    SMTP_HOST,
    SMTP_PORT = '587',
    SMTP_SECURE = 'false',
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error('Email OTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.');
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: SMTP_SECURE === 'true',
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  return transporter;
};

const saveOtp = (channel, target, otp) => {
  otpStore.set(otpKey(channel, target), {
    otpHash: hashOtp(channel, target, otp),
    expires: Date.now() + OTP_EXPIRY_MS,
    attempts: 0,
  });
};

const validateOtp = (channel, target, otp) => {
  const key = otpKey(channel, target);
  const record = otpStore.get(key);

  if (!record || Date.now() > record.expires) {
    otpStore.delete(key);
    return { valid: false, error: 'Invalid or expired OTP' };
  }

  const isMatch = record.otpHash === hashOtp(channel, target, otp);
  if (!isMatch) {
    record.attempts += 1;
    if (record.attempts >= MAX_OTP_ATTEMPTS) {
      otpStore.delete(key);
      return { valid: false, error: 'Too many failed attempts. Please request a new OTP.' };
    }
    otpStore.set(key, record);
    return { valid: false, error: 'Invalid OTP' };
  }

  otpStore.delete(key);
  return { valid: true };
};

const sendEmailOtp = async (email, otp) => {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  if (!from) {
    throw new Error('Email OTP sender is not configured. Set SMTP_FROM or SMTP_USER.');
  }

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const mailer = getTransporter();
  await mailer.sendMail({
    from,
    to: email,
    subject: 'Your MediDoseCare login OTP',
    text: `Your MediDoseCare OTP is ${otp}. It expires in 5 minutes. If you did not request this, ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.5">
        <h2>MediDoseCare Login OTP</h2>
        <p>Your OTP is:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:4px">${otp}</p>
        <p>This OTP expires in 5 minutes.</p>
        <p>If you did not request this, you can ignore this email.</p>
        <hr />
        <p style="font-size:12px;color:#555">MediDoseCare • <a href="${clientUrl}">${clientUrl}</a></p>
      </div>
    `,
  });
};

const sendOtp = async (req, res) => {
  const { phone, email } = req.body;

  if (email) {
    const normalizedEmail = normalizeEmail(email);
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    try {
      const otp = generateOtp();
      saveOtp('email', normalizedEmail, otp);
      await sendEmailOtp(normalizedEmail, otp);
      return res.json({ message: 'OTP sent successfully' });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Failed to send OTP email' });
    }
  }

  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  saveOtp('phone', phone, otp);
  console.log(`OTP for ${phone}: ${otp}`); // In production: send via SMS

  res.json({ message: 'OTP sent successfully' });
};

const verifyOtp = async (req, res) => {
  const { phone, email, otp, name } = req.body;

  if (!otp || !/^\d{4,6}$/.test(String(otp))) {
    return res.status(400).json({ error: 'Valid OTP required' });
  }

  if (email) {
    const normalizedEmail = normalizeEmail(email);
    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    const check = validateOtp('email', normalizedEmail, String(otp));
    if (!check.valid) {
      return res.status(401).json({ error: check.error });
    }

    const token = jwt.sign(
      { email: normalizedEmail, authType: 'email-otp' },
      process.env.JWT_SECRET || 'medidose_secret',
      { expiresIn: '30d' }
    );

    const userName = (name || normalizedEmail.split('@')[0] || 'User').trim();
    return res.json({
      token,
      user: {
        id: `email:${normalizedEmail}`,
        name: userName,
        email: normalizedEmail,
        role: 'patient',
      },
    });
  }

  if (!phone) return res.status(400).json({ error: 'Phone number required' });
  const check = validateOtp('phone', phone, String(otp));
  if (!check.valid) {
    return res.status(401).json({ error: check.error });
  }

  let [rows] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
  let user = rows[0];

  if (!user) {
    const [result] = await db.query(
      'INSERT INTO users (name, phone, role) VALUES (?, ?, ?)',
      [name || 'User', phone, 'patient']
    );
    [rows] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    user = rows[0];
  }

  const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET || 'medidose_secret', { expiresIn: '30d' });
  res.json({ token, user });
};

module.exports = { sendOtp, verifyOtp };
