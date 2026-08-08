const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    insertImages();
  }
});

function insertImages() {
  const images = [
    { title: 'School Campus View', category: 'campus', image_url: '/uploads/1766414029617-175683649.webp' },
    { title: 'Cultural Event', category: 'events', image_url: '/uploads/1766418211579-896944090.webp' },
    { title: 'Sports Activity', category: 'sports', image_url: '/uploads/1766575616169-430536684.webp' },
    { title: 'Library Interior', category: 'facilities', image_url: '/uploads/1766410295230-586599671.webp' },
    { title: 'Moment of Excellence 1', category: 'excellence', image_url: '/uploads/1766573122606-384588806.webp' },
    { title: 'Moment of Excellence 2', category: 'excellence', image_url: '/uploads/1766573178003-422126799.webp' }
  ];

  images.forEach((img, index) => {
    db.run('INSERT INTO gallery (title, category, year, image_url) VALUES (?, ?, ?, ?)',
      [img.title, img.category, img.year || new Date().getFullYear().toString(), img.image_url], function(err) {
      if (err) {
        console.error('Error inserting image:', err.message);
      } else {
        console.log(`Inserted image ${index + 1}: ${this.lastID}`);
      }
    });
  });

  // Close after a delay to allow inserts
  setTimeout(() => {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  }, 1000);
}