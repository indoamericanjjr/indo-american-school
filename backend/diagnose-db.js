const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, tables) => {
    if (err) {
        console.error('Error fetching tables:', err.message);
        process.exit(1);
    }

    console.log('Tables in database:');
    tables.forEach(table => {
        console.log(`- ${table.name}`);
    });

    const checkTeacherApps = tables.some(t => t.name === 'teacher_applications');
    if (checkTeacherApps) {
        console.log('\nChecking teacher_applications schema:');
        db.all("PRAGMA table_info(teacher_applications)", (err, rows) => {
            if (err) {
                console.error('Error checking teacher_applications schema:', err.message);
            } else {
                console.log('Columns:', rows.map(r => r.name).join(', '));
            }
            db.close();
        });
    } else {
        console.log('\nFAILURE: teacher_applications table NOT found!');
        db.close();
    }
});
