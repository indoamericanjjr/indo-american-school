const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    updateEvent();
  }
});

function updateEvent() {
  const event = {
    title: 'Annual Function 2025',
    description: 'Celebrating excellence and achievements at our grand annual function with performances, awards, and memorable moments.',
    date: '2025-12-15'
  };

  db.run('UPDATE past_events SET title = ?, description = ?, date = ? WHERE id = 1',
    [event.title, event.description, event.date], function(err) {
    if (err) {
      console.error('Error updating event:', err.message);
    } else {
      console.log(`Updated event: 1`);
    }
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed.');
      }
    });
  });
}