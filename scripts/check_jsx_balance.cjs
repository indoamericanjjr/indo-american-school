const fs = require('fs');
const path = process.argv[2] || 'src/pages/ErpStudentDashboard.tsx';
const src = fs.readFileSync(path, 'utf8');
// Remove JS/TS comments and JSX expressions crudely
const stripped = src
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/<!--([\s\S]*?)-->/g, '')
  .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
  .replace(/\{[\s\S]*?\}/g, '');

const lines = stripped.split(/\r?\n/);
let stack = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  // find closing divs
  const closeMatches = [...line.matchAll(/<\/([a-z0-9-]+)\s*>/gi)];
  for (const m of closeMatches) {
    const tag = m[1].toLowerCase();
    if (tag === 'div') {
      if (stack.length === 0) {
        console.log(`Unmatched closing </${tag}> at ${i+1}`);
        process.exit(0);
      }
      const top = stack[stack.length-1];
      if (top.tag === tag) {
        stack.pop();
      } else {
        console.log(`Mismatched closing </${tag}> at ${i+1}, top is <${top.tag}> opened at ${top.line}`);
        process.exit(0);
      }
    }
  }
  // find opening divs (not self-closing)
  const openMatches = [...line.matchAll(/<([a-z0-9-]+)([^>]*)>/gi)];
  for (const m of openMatches) {
    const tag = m[1].toLowerCase();
    const rest = m[2] || '';
    const selfClosing = /\/$/.test(rest.trim()) || /\/\s*>$/.test(m[0]);
    if (tag === 'div' && !selfClosing) {
      stack.push({ tag, line: i+1 });
    }
  }
}
if (stack.length > 0) {
  console.log('Unclosed tags at end of file:');
  for (const s of stack.slice(0,10)) console.log(`<${s.tag}> opened at line ${s.line}`);
  process.exit(2);
}
console.log('No unclosed <div> tags found');
