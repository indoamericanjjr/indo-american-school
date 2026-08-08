const fs = require('fs');
const path = 'src/pages/ErpStudentDashboard.tsx';
const s = fs.readFileSync(path, 'utf8');
const stack = [];
for (let i = 0; i < s.length; i++) {
  if (s[i] === '<') {
    const prev = s[i - 1] || '\n';
    const next = s[i + 1] || '';
    if (!/\w/.test(prev) || prev === '>' || prev === '\n' || prev === '\r' || prev === '(' || prev === ' ' || prev === '=' || prev === ':') {
      if (next === '/' || /[A-Za-z]/.test(next)) {
        const end = s.indexOf('>', i + 1);
        if (end === -1) break;
        const inside = s.slice(i + 1, end).trim();
        const selfClose = /\/$/.test(inside);
        const isClose = inside.startsWith('/');
        const tag = inside.replace(/^\/?\s*/, '').split(/\s|>/)[0];
        if (!isClose && !selfClose) {
          stack.push({ tag, idx: i });
        } else if (isClose) {
          if (stack.length > 0 && stack[stack.length - 1].tag.toLowerCase() === tag.toLowerCase()) {
            stack.pop();
          } else {
            console.log('Unmatched closing tag:', tag, 'at', i);
          }
        }
      }
    }
  }
}
console.log('Unclosed count:', stack.length);
if (stack.length) console.log(stack.slice(-20));
