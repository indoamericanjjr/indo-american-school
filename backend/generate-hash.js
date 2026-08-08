const bcrypt = require('bcryptjs');

// Generate hash for admin password
const password = 'IASadmin123';
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('Password:', password);
    console.log('Hash:', hash);
    console.log('\nUpdate .env ADMIN_PASSWORD_HASH with:', hash);
  }
});
