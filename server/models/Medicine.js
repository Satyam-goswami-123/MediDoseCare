const db = require('../config/db');

const getMedicinesByUser = async (userId) => {
  const [rows] = await db.query('SELECT * FROM medicines WHERE user_id = ? ORDER BY created_at DESC', [userId]);
  return rows.map(r => {
    let times = [];
    try {
      times = typeof r.times === 'string' ? JSON.parse(r.times) : (r.times || []);
      if (!Array.isArray(times)) times = [times];
    } catch (e) {
      times = ['08:00'];
    }
    return { 
      ...r, 
      times, 
      status: r.status || 'upcoming' 
    };
  });
};

const getMedicineById = async (id) => {
  const [rows] = await db.query('SELECT * FROM medicines WHERE id = ?', [id]);
  const r = rows[0];
  if (!r) return null;
  
  let times = [];
  try {
    times = typeof r.times === 'string' ? JSON.parse(r.times) : (r.times || []);
    if (!Array.isArray(times)) times = [times];
  } catch (e) {
    times = ['08:00'];
  }
  
  return { 
    ...r, 
    times, 
    status: r.status || 'upcoming' 
  };
};

const createMedicine = async (data) => {
  const { user_id, name, dosage, frequency, times, start_date, end_date, instructions, color, status = 'upcoming' } = data;
  const [result] = await db.query(
    'INSERT INTO medicines (user_id, name, dosage, frequency, times, start_date, end_date, instructions, color, status) VALUES (?,?,?,?,?,?,?,?,?,?)',
    [user_id, name, dosage, frequency, JSON.stringify(times), start_date, end_date || null, instructions || null, color || '#22C55E', status]
  );
  return getMedicineById(result.insertId);
};

const updateMedicine = async (id, data) => {
  const fields = [];
  const values = [];
  
  if (data.name) { fields.push('name=?'); values.push(data.name); }
  if (data.dosage) { fields.push('dosage=?'); values.push(data.dosage); }
  if (data.frequency) { fields.push('frequency=?'); values.push(data.frequency); }
  if (data.times) { fields.push('times=?'); values.push(JSON.stringify(data.times)); }
  if (data.start_date) { fields.push('start_date=?'); values.push(data.start_date); }
  if (data.end_date !== undefined) { fields.push('end_date=?'); values.push(data.end_date); }
  if (data.instructions !== undefined) { fields.push('instructions=?'); values.push(data.instructions); }
  if (data.color) { fields.push('color=?'); values.push(data.color); }
  if (data.status) { fields.push('status=?'); values.push(data.status); }
  
  if (fields.length === 0) return getMedicineById(id);
  
  values.push(id);
  await db.query(`UPDATE medicines SET ${fields.join(', ')} WHERE id=?`, values);
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

const reclaimMedicinesByName = async (name, currentUserId) => {
  // 1. Find all users with this name (except the current one)
  const [users] = await db.query('SELECT id FROM users WHERE name = ? AND id != ?', [name, currentUserId]);
  if (users.length === 0) return 0;
  
  const oldUserIds = users.map(u => u.id);
  
  // 2. Update all data from those users to the current user
  const idList = oldUserIds.join(',');
  
  // Update Medicines
  const [medRes] = await db.query(`UPDATE medicines SET user_id = ? WHERE user_id IN (${idList})`, [currentUserId]);
  
  // Update Health Logs
  await db.query(`UPDATE health_logs SET user_id = ? WHERE user_id IN (${idList})`, [currentUserId]);
  
  // Update Prescriptions
  await db.query(`UPDATE prescriptions SET user_id = ? WHERE user_id IN (${idList})`, [currentUserId]);
  
  // Update Dose Logs (History)
  await db.query(`UPDATE dose_logs SET user_id = ? WHERE user_id IN (${idList})`, [currentUserId]);
  
  return medRes.affectedRows;
};

module.exports = { 
  getMedicinesByUser, 
  getMedicineById, 
  createMedicine, 
  updateMedicine, 
  deleteMedicine, 
  getDoseLogs, 
  updateDoseStatus,
  reclaimMedicinesByName
};
