const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    // Fix math entries
    db.run("UPDATE timetables SET teacher_id = 46 WHERE teacher_id = 1 AND (subject LIKE '%math%' OR subject LIKE '%maath%')", function (err) {
        if (err) console.error(err.message);
        console.log(`Updated ${this.changes} math entries to teacher 46.`);
    });

    // Fix science entries
    db.run("UPDATE timetables SET teacher_id = 44 WHERE teacher_id = 1 AND subject LIKE '%science%'", function (err) {
        if (err) console.error(err.message);
        console.log(`Updated ${this.changes} science entries to teacher 44.`);
    });

    // Also check if any other entries are assigned to teacher table ID instead of profile ID
    db.all('SELECT id as t_id, profile_id as p_id FROM teachers', [], (err, mappings) => {
        if (err) return;
        mappings.forEach(m => {
            db.run("UPDATE timetables SET teacher_id = ? WHERE teacher_id = ?", [m.p_id, m.t_id], function (err2) {
                if (this.changes > 0) {
                    console.log(`Migrated ${this.changes} entries from teacher table ID ${m.t_id} to profile ID ${m.p_id}.`);
                }
            });
        });
    });
});

setTimeout(() => db.close(), 2000);
