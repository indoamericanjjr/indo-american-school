const jwt = require('jsonwebtoken');

// Simulate teacher login to get token
const teacherData = { id: 2, role: 'teacher', username: 'teacher1' };
const token = jwt.sign(teacherData, '8c13bab6bacacf20f6135c31e9cef154254fb001b02d8ae62f9168f3bd192b1a', { expiresIn: '24h' });

console.log('Teacher token:', token);

// Now test the profile API
const fetch = require('node-fetch');

fetch('http://localhost:3003/api/erp/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => {
  console.log('Response status:', res.status);
  return res.json();
})
.then(data => {
  console.log('Profile data:', data);
})
.catch(err => {
  console.error('Error:', err);
});