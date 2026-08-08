const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    insertTestData();
  }
});

async function insertTestData() {
  try {
    // Insert test students for different classes and sections
    const students = [
      // 1st Grade - Lily Section
      { username: 'student1_lily', name: 'Alice Johnson', class: '1st', section: 'Lily', roll_number: 'L001' },
      { username: 'student2_lily', name: 'Bob Smith', class: '1st', section: 'Lily', roll_number: 'L002' },

      // 1st Grade - Daisy Section
      { username: 'student3_daisy', name: 'Charlie Brown', class: '1st', section: 'Daisy', roll_number: 'D001' },
      { username: 'student4_daisy', name: 'Diana Prince', class: '1st', section: 'Daisy', roll_number: 'D002' },

      // 2nd Grade - Lily Section
      { username: 'student5_lily', name: 'Eve Wilson', class: '2nd', section: 'Lily', roll_number: 'L003' },

      // 6th Grade - Kalam Kids
      { username: 'student6_kalam', name: 'Frank Miller', class: '6th', section: 'Kalam Kids', roll_number: 'K001' },
      { username: 'student7_kalam', name: 'Grace Lee', class: '6th', section: 'Kalam Kids', roll_number: 'K002' },

      // 6th Grade - Raman Radiants
      { username: 'student8_raman', name: 'Henry Davis', class: '6th', section: 'Raman Radiants', roll_number: 'R001' },

      // 10th Grade - Kalam Kids
      { username: 'student9_kalam', name: 'Ivy Chen', class: '10th', section: 'Kalam Kids', roll_number: 'K003' },

      // 11th Grade - Science
      { username: 'student10_science', name: 'Jack Taylor', class: '11th', section: 'Science', roll_number: 'S001' },
      { username: 'student11_science', name: 'Kate Wilson', class: '11th', section: 'Science', roll_number: 'S002' },

      // 11th Grade - Commerce
      { username: 'student12_commerce', name: 'Liam Johnson', class: '11th', section: 'Commerce', roll_number: 'C001' },

      // 11th Grade - Arts
      { username: 'student13_arts', name: 'Mia Brown', class: '11th', section: 'Arts', roll_number: 'A001' },

      // 12th Grade - Science
      { username: 'student14_science', name: 'Noah Davis', class: '12th', section: 'Science', roll_number: 'S003' },

      // 12th Grade - Commerce
      { username: 'student15_commerce', name: 'Olivia Martinez', class: '12th', section: 'Commerce', roll_number: 'C002' },

      // 12th Grade - Arts
      { username: 'student16_arts', name: 'Parker Wilson', class: '12th', section: 'Arts', roll_number: 'A002' },
    ];

    const hashedPassword = await bcrypt.hash('password123', 10);

    for (const student of students) {
      // Insert profile
      db.run(
        'INSERT OR IGNORE INTO profiles (username, password, role, name, email) VALUES (?, ?, ?, ?, ?)',
        [student.username, hashedPassword, 'student', student.name, `${student.username}@school.com`],
        function(err) {
          if (err) {
            console.error('Error inserting profile:', err);
          } else {
            const profileId = this.lastID;
            // Insert student record
            db.run(
              'INSERT OR IGNORE INTO students (profile_id, class, section, roll_number, parent_name, parent_phone) VALUES (?, ?, ?, ?, ?, ?)',
              [profileId, student.class, student.section, student.roll_number, `Parent of ${student.name}`, '1234567890'],
              function(err2) {
                if (err2) {
                  console.error('Error inserting student:', err2);
                } else {
                  console.log(`Inserted student: ${student.name} (${student.class} ${student.section})`);
                }
              }
            );
          }
        }
      );
    }

    console.log('Test data insertion completed.');
    setTimeout(() => db.close(), 2000); // Give time for all inserts to complete

  } catch (error) {
    console.error('Error:', error);
    db.close();
  }
}