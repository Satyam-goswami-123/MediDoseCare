const db = require('../config/db');

const getAppointmentsByDoctor = async (doctorId) => {
  const [rows] = await db.query(`
    SELECT a.*, u.name as patientName, u.email as patientEmail 
    FROM appointments a
    JOIN users u ON a.patient_id = u.id
    WHERE a.doctor_id = ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
  `, [doctorId]);
  return rows;
};

const getAppointmentsByPatient = async (patientId) => {
  const [rows] = await db.query(`
    SELECT a.*, u.name as doctorName, dd.specialization, dd.hospital_name
    FROM appointments a
    JOIN users u ON a.doctor_id = u.id
    LEFT JOIN doctor_details dd ON u.id = dd.user_id
    WHERE a.patient_id = ?
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
  `, [patientId]);
  return rows;
};

const createAppointment = async (data) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, reason, status = 'pending' } = data;
  const [result] = await db.query(
    'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, reason, status) VALUES (?,?,?,?,?,?)',
    [patient_id, doctor_id, appointment_date, appointment_time, reason, status]
  );
  return result.insertId;
};

const updateAppointmentStatus = async (id, status) => {
  await db.query('UPDATE appointments SET status = ? WHERE id = ?', [status, id]);
};

module.exports = { 
  getAppointmentsByDoctor, 
  getAppointmentsByPatient, 
  createAppointment, 
  updateAppointmentStatus 
};
