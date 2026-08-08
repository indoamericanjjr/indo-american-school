const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.all('SELECT id, username, name FROM profiles WHERE role = "teacher"', [], (err, teachers) => {
    if (err) throw err;
    console.log('TEACHERS:', JSON.stringify(teachers));

    db.all('SELECT id, class, section, teacher_id, subject FROM timetables', [], (err2, timetable) => {
        if (err2) throw err2;
        console.log('TIMETABLE:', JSON.stringify(timetable));
        db.close();
    });
});
