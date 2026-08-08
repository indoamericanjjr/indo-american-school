const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err);
    process.exit(1);
  }
  
  console.log('✓ Database connected');
  
  // Test if profiles table exists and has data
  db.all('SELECT COUNT(*) as count FROM profiles', (err, rows) => {
    if (err) {
      console.error('✗ Error checking profiles table:', err);
    } else {
      console.log('✓ Profiles table has', rows[0].count, 'users');
    }
    
    // Test ERP login simulation
    db.get('SELECT * FROM profiles WHERE username = ?', ['admin'], (err, user) => {
      if (err) {
        console.error('✗ Error querying profiles:', err);
      } else if (user) {
        console.log('✓ Admin user exists:', user.username, '-', user.role);
      } else {
        console.log('✗ Admin user not found');
      }
      
      db.close();
    });
  });
});
