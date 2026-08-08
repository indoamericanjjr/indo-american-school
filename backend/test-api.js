const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// We'll insert a dummy mark with max_marks and verify it's there
const testMark = {
    student_id: 1, // Assumes some student exists
    class: '10th',
    section: 'A',
    subject: 'Mathematics',
    exam_type: 'unit-test',
    marks: 85.5,
    max_marks: 100,
    marked_by: 1 // Assumes some teacher/admin exists
};

console.log('Inserting test mark with max_marks...');
db.run(`INSERT INTO marks (student_id, class, section, subject, exam_type, marks, max_marks, marked_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [testMark.student_id, testMark.class, testMark.section, testMark.subject, testMark.exam_type, testMark.marks, testMark.max_marks, testMark.marked_by],
    function (err) {
        if (err) {
            console.error('Error inserting mark:', err.message);
            process.exit(1);
        }
        const insertedId = this.lastID;
        console.log('Inserted record ID:', insertedId);

        db.get('SELECT * FROM marks WHERE id = ?', [insertedId], (err, row) => {
            if (err) {
                console.error('Error retrieving mark:', err.message);
                process.exit(1);
            }
            console.log('Retrieved record:', row);
            if (row.max_marks === 100) {
                console.log('VERIFICATION SUCCESS: max_marks preserved in database.');
            } else {
                console.error('VERIFICATION FAILURE: max_marks mismatch.');
            }

            // Cleanup
            db.run('DELETE FROM marks WHERE id = ?', [insertedId], () => {
                console.log('Test record cleaned up.');
                db.close();
            });
        });
    }
);
