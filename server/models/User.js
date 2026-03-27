const db = require('../config/db');

const getUserById = async (id) => {
  const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

const updateUser = async (id, data) => {
  const { name, age, blood_group, emergency_contact } = data;
  await db.query(
    'UPDATE users SET name=?, age=?, blood_group=?, emergency_contact=? WHERE id=?',
    [name, age, blood_group, emergency_contact, id]
  );
  return getUserById(id);
};

module.exports = { getUserById, updateUser };
