const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.run("ALTER TABLE gallery ADD COLUMN year TEXT DEFAULT '2024'", (err) => {
  if (err) {
    console.error('Error adding year column:', err.message);
  } else {
    console.log('Year column added successfully');
  }
  db.close();
});