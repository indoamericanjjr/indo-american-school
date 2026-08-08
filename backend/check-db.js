require('dotenv').config({ path: '../.env' });
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
      if (err) {
        console.error('Error listing tables:', err.message);
      } else {
        console.log('Tables:', rows.map(r => r.name));
      }
      db.close();
    });
  }
});