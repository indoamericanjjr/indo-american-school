const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

console.log('Checking marks table schema...');
db.all("PRAGMA table_info(marks)", (err, rows) => {
    if (err) {
        console.error('Error checking schema:', err.message);
        process.exit(1);
    }

    const hasMaxMarks = rows.some(row => row.name === 'max_marks');
    if (hasMaxMarks) {
        console.log('SUCCESS: max_marks column found in marks table.');
        console.log('Columns:', rows.map(r => r.name).join(', '));
    } else {
        console.error('FAILURE: max_marks column NOT found in marks table.');
    }
    db.close();
});
