require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const medicineRoutes = require('./routes/medicines.routes');
const healthRoutes = require('./routes/health.routes');
const prescriptionRoutes = require('./routes/prescriptions.routes');
const notificationRoutes = require('./routes/notifications.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const sosRoutes = require('./routes/sos.routes');
const userRoutes = require('./routes/users.routes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.json({ message: 'MediDoseCare API running 🚀' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const db = require('./config/db');

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await db.query('SELECT 1');
    console.log('Database connected successfully! ✅');
  } catch (err) {
    console.error('Database connection failed! ❌');
    console.error(err.message);
  }
});
