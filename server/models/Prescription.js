const db = require('../config/db');

const getPrescriptionsByUser = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM prescriptions WHERE user_id = ? ORDER BY prescribed_date DESC',
    [userId]
  );
  return rows;
};

const getPrescriptionById = async (id) => {
  const [rows] = await db.query('SELECT * FROM prescriptions WHERE id = ?', [id]);
  return rows[0];
};

const createPrescription = async (data) => {
  const { user_id, doctor_name, hospital, prescribed_date, diagnosis, notes, image_url } = data;
  const [result] = await db.query(
    'INSERT INTO prescriptions (user_id, doctor_name, hospital, prescribed_date, diagnosis, notes, image_url) VALUES (?,?,?,?,?,?,?)',
    [user_id, doctor_name, hospital, prescribed_date, diagnosis, notes, image_url || null]
  );
  return getPrescriptionById(result.insertId);
};

const deletePrescription = async (id) => {
  await db.query('DELETE FROM prescriptions WHERE id = ?', [id]);
};

module.exports = { getPrescriptionsByUser, getPrescriptionById, createPrescription, deletePrescription };
