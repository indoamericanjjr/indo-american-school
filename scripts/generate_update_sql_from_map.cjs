const fs = require('fs');
const path = require('path');
const uploadsMapPath = path.join(__dirname, '..', 'backend', 'uploads_map.json');
const outPath = path.join(__dirname, '..', 'update_image_urls.sql');
if (!fs.existsSync(uploadsMapPath)) {
  console.error('uploads_map.json not found');
  process.exit(1);
}
const map = JSON.parse(fs.readFileSync(uploadsMapPath,'utf8'));
const tables = [
  { table: 'site_images', col: 'image_url' },
  { table: 'hero_slides', col: 'image_url' },
  { table: 'gallery', col: 'image_url' },
  { table: 'events', col: 'image_url' },
  { table: 'past_event_photos', col: 'image_url' },
  { table: 'documents', col: 'file_url' },
  { table: 'teacher_applications', col: 'resume_url' }
];
let sql = `-- Update image/file URLs to Cloudinary mapping\nBEGIN;\n`;
for (const [filename, url] of Object.entries(map)) {
  const escapedUrl = url.replace(/'/g, "''");
  const uploadRef = `/uploads/${filename}`;
  for (const t of tables) {
    sql += `UPDATE ${t.table} SET ${t.col} = '${escapedUrl}' WHERE ${t.col} = '${uploadRef}';\n`;
  }
}
sql += `COMMIT;\n`;
fs.writeFileSync(outPath, sql);
console.log('Wrote', outPath);
