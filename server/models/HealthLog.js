const db = require('../config/db');

const getHealthLogs = async (userId, limit = 10) => {
  const [rows] = await db.query(
    'SELECT * FROM health_logs WHERE user_id = ? ORDER BY recorded_at DESC LIMIT ?',
    [userId, limit]
  );
  return rows;
};

const addHealthLog = async (data) => {
  const { user_id, systolic, diastolic, heart_rate, blood_sugar, spo2, weight } = data;
  const [result] = await db.query(
    'INSERT INTO health_logs (user_id, systolic, diastolic, heart_rate, blood_sugar, spo2, weight) VALUES (?,?,?,?,?,?,?)',
    [user_id, systolic || null, diastolic || null, heart_rate || null, blood_sugar || null, spo2 || null, weight || null]
  );
  const [rows] = await db.query('SELECT * FROM health_logs WHERE id = ?', [result.insertId]);
  return rows[0];
};

const getLatestLog = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM health_logs WHERE user_id = ? ORDER BY recorded_at DESC LIMIT 1',
    [userId]
  );
  return rows[0];
};

module.exports = { getHealthLogs, addHealthLog, getLatestLog };
