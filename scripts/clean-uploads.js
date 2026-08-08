import { promises as fs } from 'fs';
import path from 'path';

const root = process.cwd();
const uploadsDir = path.join(root, 'public', 'uploads');
const scanDirs = [path.join(root, 'src'), path.join(root, 'public')]; // where references might appear

async function collectUploadFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      files.push(...await collectUploadFiles(full));
    } else if (ent.isFile()) {
      files.push(full);
    }
  }
  return files;
}

async function collectReferences() {
  const refs = new Set();
  for (const dir of scanDirs) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      for (const ent of entries) {
        const full = path.join(dir, ent.name);
        if (ent.isDirectory()) {
          // recursive read
          scanDirs.push(full);
        } else if (ent.isFile()) {
          const txt = await fs.readFile(full, 'utf-8');
          // look for any string that mentions uploads/
          const regex = /uploads\/[\w\-\.]+/g;
          let m;
          while ((m = regex.exec(txt)) !== null) {
            refs.add(m[0].replace(/\\/g, '/'));
          }
        }
      }
    } catch (e) {
      // ignore non-existent
    }
  }
  return refs;
}

async function main() {
  const files = await collectUploadFiles(uploadsDir);
  const relativeFiles = files.map(f => path.relative(root, f).replace(/\\/g, '/'));
  const refs = await collectReferences();

  console.log('Found', relativeFiles.length, 'upload files');
  console.log('Found', refs.size, 'references to uploads in code');

  const toDelete = [];
  for (const file of relativeFiles) {
    if (!refs.has(file)) {
      toDelete.push(file);
    }
  }

  if (toDelete.length === 0) {
    console.log('No unused files detected');
    return;
  }

  console.log('The following files are not referenced and will be removed:');
  toDelete.forEach(f => console.log('  ', f));

  // ask user confirmation
  process.stdout.write('Delete these files? (y/N) ');
  process.stdin.setEncoding('utf8');
  process.stdin.once('data', async (data) => {
    if (data.trim().toLowerCase() === 'y') {
      for (const rel of toDelete) {
        const full = path.join(root, rel);
        await fs.unlink(full);
      }
      console.log('Deleted', toDelete.length, 'files');
    } else {
      console.log('No files deleted');
    }
    process.exit(0);
  });
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
