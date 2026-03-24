const User = require('../models/User');

const getProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.updateUser(req.user.id, req.body);
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getProfile, updateProfile };
