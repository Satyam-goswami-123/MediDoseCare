const Notification = require('../models/Notification');
const { createNotification } = require('../models/Notification');

const getAll = async (req, res) => {
  try {
    const notifications = await Notification.getNotifications(req.user.id);
    res.json(notifications);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const markRead = async (req, res) => {
  try {
    await Notification.markAsRead(req.params.id);
    res.json({ message: 'Marked as read' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const markAllRead = async (req, res) => {
  try {
    await Notification.markAllRead(req.user.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, markRead, markAllRead };
