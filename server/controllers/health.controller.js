const Health = require('../models/HealthLog');

const getLogs = async (req, res) => {
  try {
    const logs = await Health.getHealthLogs(req.user.id, req.query.limit || 10);
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getLatest = async (req, res) => {
  try {
    const log = await Health.getLatestLog(req.user.id);
    res.json(log || {});
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const addLog = async (req, res) => {
  try {
    const log = await Health.addHealthLog({ ...req.body, user_id: req.user.id });
    res.status(201).json(log);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getLogs, getLatest, addLog };
