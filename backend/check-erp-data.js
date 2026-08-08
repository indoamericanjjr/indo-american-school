const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

const data = {};

db.all('SELECT id, username, role, name FROM profiles', [], (err, rows) => {
    if (err) throw err;
    data.profiles = rows;

    db.all('SELECT id, profile_id, subject FROM teachers', [], (err2, rows2) => {
        if (err2) throw err2;
        data.teachers = rows2;

        db.all('SELECT * FROM timetables', [], (err3, rows3) => {
            if (err3) throw err3;
            data.timetables = rows3;
            console.log(JSON.stringify(data, null, 2));
            db.close();
        });
    });
});
