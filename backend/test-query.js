const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.all('SELECT * FROM teacher_applications ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
        console.error('QUERY ERROR:', err.message);
    } else {
        console.log('Query successful, rows:', rows.length);
    }
    db.close();
});
