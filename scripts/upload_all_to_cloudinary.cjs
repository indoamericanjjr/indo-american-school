const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

const uploadsDir = path.join(__dirname, '..', 'backend', 'uploads');
const mapPath = path.join(__dirname, '..', 'backend', 'uploads_map.json');

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary env vars missing.');
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

let map = {};
if (fs.existsSync(mapPath)) {
  try { map = JSON.parse(fs.readFileSync(mapPath, 'utf8')) || {}; } catch(e) { map = {}; }
}

async function uploadFile(file) {
  const filePath = path.join(uploadsDir, file);
  if (!fs.existsSync(filePath)) return null;
  const publicId = `migrated/${path.parse(file).name}`;
  try {
    const res = await cloudinary.uploader.upload(filePath, { public_id: publicId, folder: 'ias/migrated', resource_type: 'auto' });
    return res.secure_url || res.url;
  } catch (e) {
    console.error('Upload failed for', file, e.message || e);
    return null;
  }
}

(async () => {
  const files = fs.readdirSync(uploadsDir).filter(f => f && f !== '.' && f !== '..');
  console.log('Found', files.length, 'files in uploads');
  let uploaded = 0;
  for (const file of files) {
    if (map[file]) {
      console.log('Skipping already-mapped', file);
      continue;
    }
    const url = await uploadFile(file);
    if (url) {
      map[file] = url;
      fs.writeFileSync(mapPath, JSON.stringify(map, null, 2));
      try { fs.unlinkSync(path.join(uploadsDir, file)); console.log('Deleted local', file); } catch(e){ console.warn('Failed to delete', file, e.message); }
      uploaded++;
      console.log(`Uploaded ${file} -> ${url}`);
    }
  }
  console.log(`Done. Uploaded ${uploaded} new files. Map saved to ${mapPath}`);
})();
