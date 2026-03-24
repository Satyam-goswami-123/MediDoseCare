const db = require('../config/db');

const getNotifications = async (userId) => {
  const [rows] = await db.query(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

const markAsRead = async (id) => {
  await db.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [id]);
};

const markAllRead = async (userId) => {
  await db.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [userId]);
};

const createNotification = async (data) => {
  const { user_id, title, message, type } = data;
  await db.query(
    'INSERT INTO notifications (user_id, title, message, type) VALUES (?,?,?,?)',
    [user_id, title, message, type || 'info']
  );
};

module.exports = { getNotifications, markAsRead, markAllRead, createNotification };
