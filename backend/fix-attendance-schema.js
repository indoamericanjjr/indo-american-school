const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    console.log('Starting attendance table transformation...');

    // 1. Check current schema
    db.get("SELECT sql FROM sqlite_master WHERE type='table' AND name='attendance'", (err, row) => {
        if (err) {
            console.error('Error fetching schema:', err.message);
            process.exit(1);
        }
        console.log('Current Schema:', row.sql);

        // 2. Rename old table
        db.run("ALTER TABLE attendance RENAME TO attendance_old", (err) => {
            if (err) {
                console.error('Error renaming table:', err.message);
                process.exit(1);
            }
            console.log('Renamed attendance to attendance_old');

            // 3. Create new table without restrictive CHECK or with updated CHECK
            // We'll use the original schema but with status TEXT (no check for maximum flexibility)
            // or status CHECK (status IN ('present', 'absent', 'leave'))
            db.run(`CREATE TABLE attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        class TEXT,
        section TEXT,
        date DATE NOT NULL,
        status TEXT CHECK (status IN ('present', 'absent', 'leave')),
        marked_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (marked_by) REFERENCES profiles(id)
      )`, (err) => {
                if (err) {
                    console.error('Error creating new table:', err.message);
                    // Rollback if possible (not trivial here without a real transaction block, but we can try)
                    db.run("ALTER TABLE attendance_old RENAME TO attendance");
                    process.exit(1);
                }
                console.log('Created new attendance table with updated status constraint');

                // 4. Copy data from old to new
                db.run("INSERT INTO attendance (id, student_id, class, section, date, status, marked_by, created_at) SELECT id, student_id, class, section, date, status, marked_by, created_at FROM attendance_old", (err) => {
                    if (err) {
                        console.error('Error copying data:', err.message);
                        process.exit(1);
                    }
                    console.log('Copied data to new attendance table');

                    // 5. Drop old table
                    db.run("DROP TABLE attendance_old", (err) => {
                        if (err) {
                            console.error('Error dropping old table:', err.message);
                            process.exit(1);
                        }
                        console.log('Dropped attendance_old table');
                        console.log('Attendance table fixed successfully!');
                        db.close();
                    });
                });
            });
        });
    });
});
