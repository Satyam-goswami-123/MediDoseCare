const db = require('../config/db');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Medicine = require('../models/Medicine');

const otpStore = new Map(); // In-memory OTP store (use Redis in production)
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_OTP_ATTEMPTS = 5;

const normalizeEmail = (email = '') => email.trim().toLowerCase();
const otpKey = (channel, target) => `${channel}:${target}`;
const hashOtp = (channel, target, otp) =>
  crypto.createHash('sha256').update(`${channel}:${target}:${otp}`).digest('hex');
const generateOtp = () => crypto.randomInt(100000, 1000000).toString();
const isValidEmail = (email = '') => {
  const normalized = normalizeEmail(email);
  const parts = normalized.split('@');
  if (parts.length !== 2) return false;
  const [localPart, domainPart] = parts;
  if (!localPart || !domainPart) return false;
  if (!domainPart.includes('.')) return false;
  if (localPart.length > 64 || domainPart.length > 253) return false;
  return true;
};

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
    if (!isValidEmail(normalizedEmail)) {
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

  const otp = crypto.randomInt(1000, 10000).toString();
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
    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({ error: 'Valid email address required' });
    }

    const check = validateOtp('email', normalizedEmail, String(otp));
    if (!check.valid) {
      return res.status(401).json({ error: check.error });
    }

    // Check if user exists in DB
    let [rows] = await db.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
    let user = rows[0];

    if (!user) {
      // Create new user if they don't exist
      const userName = name || (normalizedEmail.split('@')[0] || 'User').trim();

      // Generate Unique ID (Readable)
      const prefix = 'MDC-P';
      const [countRow] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "patient"');
      const nextId = (countRow[0].count + 1).toString().padStart(3, '0');
      const uniqueId = `${prefix}-${nextId}`;

      const [result] = await db.query(
        'INSERT INTO users (unique_id, name, email, role) VALUES (?, ?, ?, ?)',
        [uniqueId, userName, normalizedEmail, 'patient']
      );
      [rows] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = rows[0];
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'medidose_secret',
      { expiresIn: '30d' }
    );

    return res.json({ token, user });
  }

  if (!phone) return res.status(400).json({ error: 'Phone number required' });
  const check = validateOtp('phone', phone, String(otp));
  if (!check.valid) {
    return res.status(401).json({ error: check.error });
  }

  let [rows] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
  let user = rows[0];

  if (!user) {
    // Generate Unique ID
    const prefix = 'MDC-P';
    const [countRow] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = "patient"');
    const nextId = (countRow[0].count + 1).toString().padStart(3, '0');
    const uniqueId = `${prefix}-${nextId}`;

    const [result] = await db.query(
      'INSERT INTO users (unique_id, name, phone, role) VALUES (?, ?, ?, ?)',
      [uniqueId, name || 'User', phone, 'patient']
    );
    [rows] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
    user = rows[0];
  }

  const token = jwt.sign({ id: user.id, phone: user.phone }, process.env.JWT_SECRET || 'medidose_secret', { expiresIn: '30d' });
  res.json({ token, user });
};

const signup = async (req, res) => {
  const { uid, name, phone, email, role, specialization, hospitalName } = req.body;

  try {
    // Check if user already exists
    const [existing] = await db.query('SELECT * FROM users WHERE phone = ? OR email = ?', [phone, email]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    let prefix = 'MDC-U';
    if (role === 'doctor') prefix = 'MDC-D';
    else if (role === 'patient') prefix = 'MDC-P';
    else if (role === 'caregiver') prefix = 'MDC-C';

    const [countRow] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = ?', [role]);
    const nextId = (countRow[0].count + 1).toString().padStart(3, '0');
    const uniqueId = `${prefix}-${nextId}`;

    // Insert User
    const [result] = await db.query(
      'INSERT INTO users (unique_id, name, phone, email, role) VALUES (?, ?, ?, ?, ?)',
      [uniqueId, name, phone, email, role]
    );

    const userId = result.insertId;

    // If doctor, insert details
    if (role === 'doctor') {
      await db.query(
        'INSERT INTO doctor_details (user_id, specialization, hospital_name) VALUES (?, ?, ?)',
        [userId, specialization, hospitalName]
      );
    }

    res.status(201).json({ message: 'User registered successfully', uniqueId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  const { email, role } = req.body; // In a real app, verify Firebase token or password here

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email = ? AND role = ?', [email, role]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'medidose_secret',
      { expiresIn: '30d' }
    );

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const socialLogin = async (req, res) => {
  const { email, name, phone, uid, role = 'patient' } = req.body;

  try {
    const normalizedEmail = email ? email.toLowerCase().trim() : null;
    let user = null;

    // 1. Try to find user by firebase_uid (Most Stable)
    if (uid) {
      const [uidRows] = await db.query('SELECT * FROM users WHERE firebase_uid = ?', [uid]);
      user = uidRows[0] || null;
    }

    // 2. Try to find user by email (Backup)
    if (!user && normalizedEmail) {
      const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [normalizedEmail]);
      user = rows[0] || null;

      // If found by email but uid is missing, link the uid now
      if (user && uid && !user.firebase_uid) {
        await db.query('UPDATE users SET firebase_uid = ? WHERE id = ?', [uid, user.id]);
        user.firebase_uid = uid;
      }
    }

    // 3. Try to find by Phone if provided
    if (!user && phone) {
      const [phoneRows] = await db.query('SELECT * FROM users WHERE phone = ?', [phone]);
      user = phoneRows[0] || null;
    }

    // 4. Try to find by Name as a last resort
    if (!user && name) {
      const [nameRows] = await db.query('SELECT * FROM users WHERE name = ?', [name]);
      user = nameRows[0] || null;
    }

    if (user) {
      // Update missing fields on existing user
      const updates = [];
      const vals = [];
      if (normalizedEmail && !user.email) { updates.push('email=?'); vals.push(normalizedEmail); }
      if (name && !user.name) { updates.push('name=?'); vals.push(name); }
      if (updates.length > 0) {
        vals.push(user.id);
        await db.query(`UPDATE users SET ${updates.join(',')} WHERE id=?`, vals);
        // Re-fetch updated user
        const [refreshed] = await db.query('SELECT * FROM users WHERE id = ?', [user.id]);
        user = refreshed[0];
      }
    } else {
      // Create new user — phone is now optional in DB
      const [countRow] = await db.query('SELECT COUNT(*) as count FROM users WHERE role = ?', [role]);
      const nextId = (countRow[0].count + 1).toString().padStart(3, '0');
      const prefix = role === 'doctor' ? 'MDC-D' : 'MDC-P';
      const uniqueId = `${prefix}-${nextId}`;

      const [result] = await db.query(
        'INSERT INTO users (unique_id, name, email, phone, role) VALUES (?, ?, ?, ?, ?)',
        [uniqueId, name || 'User', normalizedEmail || null, phone || null, role]
      );
      const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);
      user = newUser[0];
    }

    // 4. ACCOUNT RECLAMATION: Automatically merge data from older accounts
    // If this is a new Gmail login but there are medicines under the same Name,
    // we move them to this new authenticated account immediately.
    if (user.name) {
      const reclaimedCount = await Medicine.reclaimMedicinesByName(user.name, user.id);
      if (reclaimedCount > 0) {
        console.log(`[Sync] Successfully reclaimed ${reclaimedCount} medicines for User: ${user.name} (ID: ${user.id})`);
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'medidose_secret',
      { expiresIn: '30d' }
    );

    res.json({ token, user });
  } catch (err) {
    console.error('socialLogin error:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { sendOtp, verifyOtp, signup, login, socialLogin };
