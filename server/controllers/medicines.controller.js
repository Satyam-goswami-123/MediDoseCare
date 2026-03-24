const Medicine = require('../models/Medicine');

const getAll = async (req, res) => {
  try {
    const medicines = await Medicine.getMedicinesByUser(req.user.id);
    res.json(medicines);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getOne = async (req, res) => {
  try {
    const med = await Medicine.getMedicineById(req.params.id);
    if (!med) return res.status(404).json({ error: 'Not found' });
    res.json(med);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const med = await Medicine.createMedicine({ ...req.body, user_id: req.user.id });
    res.status(201).json(med);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const update = async (req, res) => {
  try {
    const med = await Medicine.updateMedicine(req.params.id, req.body);
    res.json(med);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    await Medicine.deleteMedicine(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getDoseLogs = async (req, res) => {
  try {
    const logs = await Medicine.getDoseLogs(req.user.id);
    res.json(logs);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const updateDose = async (req, res) => {
  try {
    await Medicine.updateDoseStatus(req.params.logId, req.body.status);
    res.json({ message: 'Dose status updated' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, getOne, create, update, remove, getDoseLogs, updateDose };
