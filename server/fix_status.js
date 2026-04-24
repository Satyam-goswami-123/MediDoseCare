require('dotenv').config();
const db = require('./config/db');

async function fix() {
  try {
    const [columns] = await db.query('SHOW COLUMNS FROM medicines LIKE "status"');
    if (columns.length === 0) {
      await db.query("ALTER TABLE medicines ADD COLUMN status ENUM('upcoming','taken','missed') DEFAULT 'upcoming'");
      console.log('✅ Status column added successfully!');
    } else {
      console.log('ℹ️ Status column already exists.');
    }
    process.exit(0);
  } catch (err) {
    console.error('❌ Error fixing DB:', err.message);
    process.exit(1);
  }
}

fix();
