const db = require('../config/db');

const getMedicinesByUser = async (userId) => {
  const [rows] = await db.query('SELECT * FROM medicines WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows;
};

const getMedicineById = async (id) => {
  const [rows] = await db.query('SELECT * FROM medicines WHERE id = ?', [id]);
  return rows[0];
};

const createMedicine = async (data) => {
  const { user_id, name, dosage, frequency, times, start_date, end_date, instructions, color } = data;
  const [result] = await db.query(
    'INSERT INTO medicines (user_id, name, dosage, frequency, times, start_date, end_date, instructions, color) VALUES (?,?,?,?,?,?,?,?,?)',
    [user_id, name, dosage, frequency, JSON.stringify(times), start_date, end_date || null, instructions || null, color || '#22C55E']
  );
  return getMedicineById(result.insertId);
};

const updateMedicine = async (id, data) => {
  const { name, dosage, frequency, times, end_date, instructions, color } = data;
  await db.query(
    'UPDATE medicines SET name=?, dosage=?, frequency=?, times=?, end_date=?, instructions=?, color=? WHERE id=?',
    [name, dosage, frequency, JSON.stringify(times), end_date || null, instructions, color, id]
  );
  return getMedicineById(id);
};

const deleteMedicine = async (id) => {
  await db.query('DELETE FROM medicines WHERE id = ?', [id]);
};

const getDoseLogs = async (userId) => {
  const [rows] = await db.query(
    `SELECT dl.*, m.name, m.dosage, m.color FROM dose_logs dl
     JOIN medicines m ON dl.medicine_id = m.id
     WHERE dl.user_id = ? ORDER BY dl.scheduled_time DESC LIMIT 50`,
    [userId]
  );
  return rows;
};

const updateDoseStatus = async (logId, status) => {
  const takenAt = status === 'taken' ? new Date() : null;
  await db.query('UPDATE dose_logs SET status=?, taken_at=? WHERE id=?', [status, takenAt, logId]);
};

module.exports = { getMedicinesByUser, getMedicineById, createMedicine, updateMedicine, deleteMedicine, getDoseLogs, updateDoseStatus };
