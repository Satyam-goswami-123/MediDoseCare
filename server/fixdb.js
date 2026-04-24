require('dotenv').config();
const db = require('./config/db');

async function fixDatabase() {
  try {
    // 1. Add status column to medicines
    await db.query(
      "ALTER TABLE medicines ADD COLUMN IF NOT EXISTS status ENUM('upcoming','taken','missed') DEFAULT 'upcoming'"
    ).catch(() => console.log('status column may already exist, skipping'));

    // 2. Show current users
    const [users] = await db.query('SELECT id, name, email, phone FROM users');
    console.log('Current users in DB:');
    console.log(JSON.stringify(users, null, 2));

    // 3. Show current medicines
    const [meds] = await db.query('SELECT id, user_id, name FROM medicines');
    console.log('Current medicines in DB:');
    console.log(JSON.stringify(meds, null, 2));

    console.log('\n✅ Database check complete!');
    process.exit(0);
  } catch (err) {
    console.error('ERROR:', err.message);
    process.exit(1);
  }
}

fixDatabase();
