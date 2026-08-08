const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.serialize(() => {
      // Profiles table
      db.run(`CREATE TABLE IF NOT EXISTS profiles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
        name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Teachers table
      db.run(`CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        subject TEXT,
        assigned_class TEXT,
        assigned_section TEXT,
        qualification TEXT,
        experience INTEGER,
        FOREIGN KEY (profile_id) REFERENCES profiles(id)
      )`);

      // Students table
      db.run(`CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        profile_id INTEGER,
        class TEXT,
        section TEXT,
        roll_number TEXT,
        date_of_birth DATE,
        parent_name TEXT,
        parent_phone TEXT,
        FOREIGN KEY (profile_id) REFERENCES profiles(id)
      )`);

      // Classes table
      db.run(`CREATE TABLE IF NOT EXISTS classes (
        id TEXT PRIMARY KEY,
        name TEXT,
        teacher_id INTEGER,
        FOREIGN KEY (teacher_id) REFERENCES profiles(id)
      )`);

      // Attendance table
      db.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        class TEXT,
        section TEXT,
        date DATE NOT NULL,
        status TEXT CHECK (status IN ('present', 'absent')),
        marked_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (marked_by) REFERENCES profiles(id)
      )`);

      // Marks table
      db.run(`CREATE TABLE IF NOT EXISTS marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        class TEXT,
        section TEXT,
        subject TEXT,
        exam_type TEXT,
        marks REAL,
        marked_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (marked_by) REFERENCES profiles(id)
      )`);

      // Homework table
      db.run(`CREATE TABLE IF NOT EXISTS homework (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacher_id INTEGER,
        class TEXT,
        section TEXT,
        subject TEXT,
        title TEXT,
        content TEXT,
        due_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES profiles(id)
      )`);

      // Announcements table
      db.run(`CREATE TABLE IF NOT EXISTS erp_announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_by INTEGER,
        class TEXT,
        section TEXT,
        title TEXT,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES profiles(id)
      )`);

      // Complaints table
      db.run(`CREATE TABLE IF NOT EXISTS complaints (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_by INTEGER,
        title TEXT,
        content TEXT,
        status TEXT DEFAULT 'pending',
        assigned_to INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (created_by) REFERENCES profiles(id),
        FOREIGN KEY (assigned_to) REFERENCES profiles(id)
      )`);

      // Insert admin user
      db.run(`INSERT OR IGNORE INTO profiles (username, password, role, name) VALUES ('ias', 'admin', 'admin', 'Administrator')`);

      // Add section column to existing tables if it doesn't exist
      db.run(`ALTER TABLE students ADD COLUMN section TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Section column already exists in students table or error:', err.message);
        }
      });

      db.run(`ALTER TABLE teachers ADD COLUMN assigned_section TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Assigned_section column already exists in teachers table or error:', err.message);
        }
      });

      db.run(`ALTER TABLE attendance ADD COLUMN section TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Section column already exists in attendance table or error:', err.message);
        }
      });

      db.run(`ALTER TABLE marks ADD COLUMN section TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Section column already exists in marks table or error:', err.message);
        }
      });

      // Attendance table
      db.run(`CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        class TEXT,
        section TEXT,
        date DATE,
        status TEXT,
        marked_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Marks table
      db.run(`CREATE TABLE IF NOT EXISTS marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        class TEXT,
        section TEXT,
        subject TEXT,
        exam_type TEXT,
        marks REAL,
        marked_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // Homework table
      db.run(`CREATE TABLE IF NOT EXISTS homework (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        teacher_id INTEGER,
        class TEXT,
        section TEXT,
        subject TEXT,
        title TEXT,
        content TEXT,
        due_date DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      // ERP Announcements table
      db.run(`CREATE TABLE IF NOT EXISTS erp_announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_by INTEGER,
        class TEXT,
        section TEXT,
        title TEXT,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

      db.run(`ALTER TABLE homework ADD COLUMN section TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Section column already exists in homework table or error:', err.message);
        }
      });

      db.run(`ALTER TABLE erp_announcements ADD COLUMN section TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column name')) {
          console.log('Section column already exists in erp_announcements table or error:', err.message);
        }
      });

      console.log('ERP tables created successfully.');
    });
  }
});