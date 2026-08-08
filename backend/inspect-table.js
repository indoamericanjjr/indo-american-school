const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

console.log('--- Table Info ---');
db.all("PRAGMA table_info(teacher_applications)", (err, rows) => {
    if (err) {
        console.error('Error:', err.message);
    } else {
        rows.forEach(row => {
            console.log(JSON.stringify(row));
        });
    }

    console.log('\n--- First 5 Rows ---');
    db.all("SELECT * FROM teacher_applications LIMIT 5", (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err.message);
        } else {
            console.log(JSON.stringify(rows, null, 2));
        }
        db.close();
    });
});
