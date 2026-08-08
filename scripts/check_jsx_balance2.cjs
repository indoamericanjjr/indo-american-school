const fs = require('fs');
const path = process.argv[2] || 'src/pages/ErpStudentDashboard.tsx';
const src = fs.readFileSync(path, 'utf8');
let stack = [];
let i = 0;
let line = 1;
const isNameChar = (c) => /[A-Za-z0-9:-]/.test(c);
while (i < src.length) {
  const c = src[i];
  if (c === '\n') { line++; i++; continue; }
  if (c === '{') {
    // skip balanced braces
    let depth = 1; i++;
    while (i < src.length && depth > 0) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') depth--;
      if (src[i] === '\n') line++;
      i++;
    }
    continue;
  }
  if (c === '<') {
    // if it's a comment <!-- skip -->
    if (src.slice(i, i+4) === '<!--') {
      i += 4;
      while (i < src.length && src.slice(i, i+3) !== '-->') {
        if (src[i] === '\n') line++;
        i++;
      }
      i += 3; continue;
    }
    // detect closing
    const isClose = src[i+1] === '/';
    let j = i + (isClose ? 2 : 1);
    // skip whitespace
    while (j < src.length && /\s/.test(src[j])) j++;
    // read tag name
    let name = '';
    while (j < src.length && isNameChar(src[j])) { name += src[j]; j++; }
    name = name.toLowerCase();
    // advance to end of tag (>) but track if self-closing
    let selfClosing = false;
    while (j < src.length && src[j] !== '>') { if (src[j] === '\n') line++; if (src[j] === '/') selfClosing = true; j++; }
    if (j < src.length && src[j] === '>') {
      // move i to after '>'
      i = j+1;
    } else { i = j; }
    if (!name) continue;
    // only track lowercase html tags
    if (!/^[a-z]/.test(name)) continue;
    if (!isClose) {
      if (!selfClosing) stack.push({tag: name, line});
    } else {
      if (stack.length === 0) { console.log(`Unmatched closing </${name}> at line ${line}`); process.exit(1); }
      const top = stack[stack.length-1];
      if (top.tag === name) stack.pop(); else { console.log(`Mismatched closing </${name}> at line ${line}, top <${top.tag}> opened at ${top.line}`); process.exit(1); }
    }
    continue;
  }
  i++;
}
if (stack.length) {
  console.log('Unclosed tags:');
  stack.slice(0,10).forEach(s => console.log(`<${s.tag}> opened at line ${s.line}`));
  process.exit(2);
}
console.log('All tracked tags closed');
