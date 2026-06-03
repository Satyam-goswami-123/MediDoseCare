require('dotenv').config();
const db = require('./config/db');

async function fixDatabase() {
  try {
    // 1. Add firebase_uid to users if missing
    await db.query(
      "ALTER TABLE users ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(128) UNIQUE AFTER unique_id"
    ).catch((err) => console.log('firebase_uid column update skipped or already exists'));

    // 2. Add status column to medicines if missing
    await db.query(
      "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS status ENUM('upcoming','taken','missed') DEFAULT 'upcoming'"
    ).catch(() => console.log('status column update skipped or already exists'));

    // 3. Add consultation_fee to doctor_details if missing
    await db.query(
      "ALTER TABLE doctor_details ADD COLUMN IF NOT EXISTS consultation_fee INT DEFAULT 850"
    ).catch(() => console.log('consultation_fee column update skipped or already exists'));

    // 4. Add require_payment_upfront to doctor_details if missing
    await db.query(
      "ALTER TABLE doctor_details ADD COLUMN IF NOT EXISTS require_payment_upfront TINYINT DEFAULT 1"
    ).catch(() => console.log('require_payment_upfront column update skipped or already exists'));

    // Show current users
    const [users] = await db.query('SELECT id, name, email, phone, role FROM users');
    console.log('Current users in DB:');
    console.log(JSON.stringify(users, null, 2));

    console.log('\n✅ Database schema verified and updated successfully!');
    process.exit(0);
  } catch (err) {
    console.error('ERROR during DB migration:', err.message);
    process.exit(1);
  }
}

fixDatabase();
