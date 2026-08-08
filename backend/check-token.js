const jwt = require('jsonwebtoken');

const secret = '8c13bab6bacacf20f6135c31e9cef154254fb001b02d8ae62f9168f3bd192b1a';

// Test token from earlier
const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwicm9sZSI6InRlYWNoZXIiLCJ1c2VybmFtZSI6InRlYWNoZXIxIiwiaWF0IjoxNzY4OTgzMDM1LCJleHAiOjE3NjkwNjk0MzV9.-xcrDzjl6xaIRcaPnRrhQJuReeSrw4YF3obnEu8UHwI';

try {
  const decoded = jwt.verify(testToken, secret);
  console.log('Token is valid:', decoded);
  console.log('Expires:', new Date(decoded.exp * 1000));
} catch (err) {
  console.log('Token verification failed:', err.message);
}