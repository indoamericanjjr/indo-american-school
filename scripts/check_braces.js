const fs=require('fs');
const s=fs.readFileSync('src/pages/ErpStudentDashboard.tsx','utf8');
console.log('backticks', (s.match(/`/g)||[]).length, 'single', (s.match(/'/g)||[]).length, 'double', (s.match(/"/g)||[]).length, 'openBrace', (s.match(/{/g)||[]).length, 'closeBrace', (s.match(/}/g)||[]).length);
