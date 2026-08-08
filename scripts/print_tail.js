const fs=require('fs');
const s=fs.readFileSync('src/pages/ErpStudentDashboard.tsx','utf8');
console.log(s.slice(-500));
