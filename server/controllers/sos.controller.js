const db = require('../config/db');
const { createNotification } = require('../models/Notification');

const triggerSos = async (req, res) => {
  try {
    const userId = req.user.id;
    const { location } = req.body;

    // Get user info and emergency contact
    const [users] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
    const user = users[0];

    // Log SOS as notification
    await createNotification({
      user_id: userId,
      title: '🆘 SOS Triggered',
      message: `Emergency SOS triggered by ${user.name}. Location: ${location || 'Unknown'}`,
      type: 'sos',
    });

    // In production: send SMS/push to emergency_contact
    res.json({
      message: 'SOS triggered successfully',
      contacted: user.emergency_contact || 'No emergency contact set',
      user: user.name,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { triggerSos };
