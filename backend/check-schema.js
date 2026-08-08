const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
function printSchema(name) {
  db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name=?", [name], (err, row) => {
    if (err) console.error(err);
    else {
      console.log(`--- SCHEMA ${name} ---`);
      console.log(row ? row.sql : 'NOT FOUND');
      console.log(`--- END ${name} ---`);
    }
  });
}
printSchema('attendance');
printSchema('marks');

// close after small delay
setTimeout(() => db.close(), 500);
