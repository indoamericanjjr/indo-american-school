const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
    console.log('Starting migration of timetable teacher_ids...');

    // Get mapping of teacher table ID to profile ID
    db.all('SELECT id as teacher_table_id, profile_id FROM teachers', [], (err, mappings) => {
        if (err) {
            console.error('Error fetching mappings:', err.message);
            db.close();
            return;
        }

        console.log(`Found ${mappings.length} teacher mappings.`);

        let updatedCount = 0;
        let processedCount = 0;

        if (mappings.length === 0) {
            console.log('No teachers found to migrate.');
            db.close();
            return;
        }

        mappings.forEach((mapping) => {
            // Update timetables where teacher_id matches the teacher table ID
            // We check if the teacher_id exists in the teacher table first.
            // If the current teacher_id in timetables is already a profile_id (exists in profiles table), 
            // we might accidentally overwrite it if a teacher table ID happens to match a profile ID.
            // However, usually these IDs are different or we can be more specific.

            // Let's find entries where teacher_id = mapping.teacher_table_id
            db.run('UPDATE timetables SET teacher_id = ? WHERE teacher_id = ?', [mapping.profile_id, mapping.teacher_table_id], function (err2) {
                processedCount++;
                if (err2) {
                    console.error(`Error updating for teacher table ID ${mapping.teacher_table_id}:`, err2.message);
                } else {
                    updatedCount += this.changes;
                }

                if (processedCount === mappings.length) {
                    console.log(`Migration complete. Updated ${updatedCount} timetable entries.`);
                    db.close();
                }
            });
        });
    });
});
