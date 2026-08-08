const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.all('SELECT * FROM teachers', [], (err, rows) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Teachers table:', rows);
  }
  db.close();
});