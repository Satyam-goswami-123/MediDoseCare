const Appointment = require('../models/Appointment');

const getAll = async (req, res) => {
  try {
    let appointments;
    if (req.user.role === 'doctor') {
      appointments = await Appointment.getAppointmentsByDoctor(req.user.id);
    } else {
      appointments = await Appointment.getAppointmentsByPatient(req.user.id);
    }
    res.json(appointments || []);
  } catch (err) { 
    console.error('Error in appointments.getAll:', err);
    res.status(500).json({ error: err.message }); 
  }
};

const create = async (req, res) => {
  try {
    const appointmentId = await Appointment.createAppointment({ 
      ...req.body, 
      patient_id: req.user.id 
    });
    res.status(201).json({ id: appointmentId, message: 'Appointment booked' });
  } catch (err) { 
    console.error('Error in appointments.create:', err);
    res.status(500).json({ error: err.message }); 
  }
};

const updateStatus = async (req, res) => {
  try {
    await Appointment.updateAppointmentStatus(req.params.id, req.body.status);
    res.json({ message: 'Status updated' });
  } catch (err) { 
    console.error('Error in appointments.updateStatus:', err);
    res.status(500).json({ error: err.message }); 
  }
};

module.exports = { getAll, create, updateStatus };
