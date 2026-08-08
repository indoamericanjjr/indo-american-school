const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    console.log('Starting migration for complaints table...');

    // Add student_id column
    db.run(`ALTER TABLE complaints ADD COLUMN student_id INTEGER`, (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('student_id column already exists.');
            } else {
                console.error('Error adding student_id:', err.message);
            }
        } else {
            console.log('Added student_id column.');
        }
    });

    // Add complaint_date column
    db.run(`ALTER TABLE complaints ADD COLUMN complaint_date DATE`, (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('complaint_date column already exists.');
            } else {
                console.error('Error adding complaint_date:', err.message);
            }
        } else {
            console.log('Added complaint_date column.');
        }
    });

    console.log('Migration steps initiated.');
});

// Close connection after a short delay to allow async runs to finish
setTimeout(() => {
    db.close(() => {
        console.log('Database connection closed.');
    });
}, 2000);
