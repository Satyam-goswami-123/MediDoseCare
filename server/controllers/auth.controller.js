const db = require('../config/db');
const jwt = require('jsonwebtoken');

const otpStore = {}; // In-memory OTP store (use Redis in production)

const sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number required' });

  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 };
  console.log(`OTP for ${phone}: ${otp}`); // In production: send via SMS

  res.json({ message: 'OTP sent successfully', dev_otp: otp });
};

const verifyOtp = async (req, res) => {
  const { phone, otp, name } = req.body;
  const record = otpStore[phone];

  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(401).json({ error: 'Invalid or expired OTP' });
  }

  delete otpStore[phone];

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
