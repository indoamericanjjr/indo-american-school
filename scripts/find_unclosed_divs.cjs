const fs = require('fs');
const path = process.argv[2] || 'src/pages/ErpStudentDashboard.tsx';
const src = fs.readFileSync(path, 'utf8');
const lines = src.split(/\r?\n/);
const stack = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // remove JSX expressions content to avoid confusion: naive remove {...}
  let cleaned = '';
  let depth = 0;
  for (let ch of line) {
    if (ch === '{') { depth++; cleaned += ' '; continue; }
    if (ch === '}') { if (depth>0) depth--; cleaned += ' '; continue; }
    if (depth>0) { cleaned += ' '; continue; }
    cleaned += ch;
  }
  // find opens but ignore self-closing <div ... />
  const openMatches = Array.from(cleaned.matchAll(/<div\b[^>]*>/gi));
  const opens = openMatches.filter(m => !/\/>$/.test(m[0].trim())).length;
  const closes = Array.from(cleaned.matchAll(/<\/div>/gi)).length;
  for (let j = 0; j < openMatches.length; j++) {
    const m = openMatches[j][0];
    if (!/\/>$/.test(m.trim())) stack.push({line: i+1, text: lines[i].trim()});
  }
  for (let j = 0; j < closes; j++) {
    if (stack.length === 0) {
      console.log(`Unmatched closing </div> at line ${i+1}`);
    } else {
      stack.pop();
    }
  }
}
if (stack.length === 0) {
  console.log('All <div> tags closed');
} else {
  console.log(`Unclosed <div> tags: ${stack.length}`);
  stack.slice(0, 30).forEach(s => console.log(`<div> opened at line ${s.line}: ${s.text}`));
}
