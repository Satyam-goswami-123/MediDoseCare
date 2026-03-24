const Prescription = require('../models/Prescription');

const getAll = async (req, res) => {
  try {
    const prescriptions = await Prescription.getPrescriptionsByUser(req.user.id);
    res.json(prescriptions);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const getOne = async (req, res) => {
  try {
    const rx = await Prescription.getPrescriptionById(req.params.id);
    if (!rx) return res.status(404).json({ error: 'Not found' });
    res.json(rx);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const create = async (req, res) => {
  try {
    const rx = await Prescription.createPrescription({ ...req.body, user_id: req.user.id });
    res.status(201).json(rx);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

const remove = async (req, res) => {
  try {
    await Prescription.deletePrescription(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

module.exports = { getAll, getOne, create, remove };
