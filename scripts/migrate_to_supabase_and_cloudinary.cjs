/*
Migration script (CommonJS)
- Uploads images from backend/uploads to Cloudinary
- Attempts to insert rows into Supabase (requires tables created in Supabase matching schema)
- If Supabase insert fails, writes SQL INSERT statements to ./migration_sql.sql

Usage (PowerShell):
$env:SUPABASE_URL="https://..."; $env:SUPABASE_SERVICE_ROLE_KEY="..."; $env:CLOUDINARY_CLOUD_NAME="..."; $env:CLOUDINARY_API_KEY="..."; $env:CLOUDINARY_API_SECRET="..."; node scripts/migrate_to_supabase_and_cloudinary.cjs

Be careful: this will delete local uploaded files after successful Cloudinary upload.
*/

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const cloudinary = require('cloudinary').v2;
const { createClient } = require('@supabase/supabase-js');

const uploadsDir = path.join(__dirname, '..', 'backend', 'uploads');
const dbPath = path.join(__dirname, '..', 'backend', 'database.db');
const outSqlPath = path.join(__dirname, '..', 'migration_sql.sql');

// configure cloudinary
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('Cloudinary env vars missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
  process.exit(1);
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

let supabase = null;
if (process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)) {
  supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY);
  console.log('Supabase client configured');
}

const sqlite = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error('Failed to open sqlite db:', err.message);
    process.exit(1);
  }
});
// load uploads_map if present
let uploadsMap = {};
const uploadsMapPath = path.join(__dirname, '..', 'backend', 'uploads_map.json');
if (fs.existsSync(uploadsMapPath)) {
  try { uploadsMap = JSON.parse(fs.readFileSync(uploadsMapPath, 'utf8')) || {}; console.log('Loaded uploads_map with', Object.keys(uploadsMap).length, 'entries'); } catch(e) { uploadsMap = {}; }
}

function uploadFileToCloudinary(filePath, folder) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, { folder: folder || 'ias/migrated', resource_type: 'auto' }, (err, res) => {
      if (err) return reject(err);
      resolve(res.secure_url || res.url);
    });
  });
}

function writeSqlInsert(table, row) {
  const cols = Object.keys(row).map(c => `"${c}"`).join(', ');
  const vals = Object.values(row).map(v => {
    if (v === null || v === undefined) return 'NULL';
    // escape single quotes
    if (typeof v === 'number') return v;
    return `'${String(v).replace(/'/g, "''").replace(/\n/g, '\\n')}'`;
  }).join(', ');
  const stmt = `INSERT INTO public."${table}" (${cols}) VALUES (${vals});\n`;
  fs.appendFileSync(outSqlPath, stmt);
}

async function migrateTable(tableName, imageFields = []) {
  console.log(`Migrating table: ${tableName}`);
  return new Promise((resolve, reject) => {
    sqlite.all(`SELECT * FROM ${tableName}`, async (err, rows) => {
      if (err) {
        console.warn(`Skipping ${tableName}: ${err.message}`);
        return resolve();
      }
      for (const row of rows) {
        // handle image fields
        for (const field of imageFields) {
          if (row[field] && typeof row[field] === 'string' && row[field].startsWith('/uploads/')) {
            const filename = row[field].replace(/^\/+/, '');
            // prefer uploadsMap if we have a mapping
            if (uploadsMap[filename]) {
              row[field] = uploadsMap[filename];
            } else {
              const localPath = path.join(uploadsDir, filename);
              if (fs.existsSync(localPath)) {
                try {
                  const url = await uploadFileToCloudinary(localPath, `ias/${tableName}`);
                  console.log(`Uploaded ${localPath} -> ${url}`);
                  row[field] = url;
                  try { fs.unlinkSync(localPath); console.log(`Deleted local ${localPath}`); } catch(e) { console.warn('Failed to delete', localPath, e.message); }
                } catch (uerr) {
                  console.error('Cloudinary upload failed for', localPath, uerr.message);
                }
              } else {
                console.warn('Local file not found and no mapping for:', filename);
              }
            }
          }
        }

        if (supabase) {
          try {
            const { data, error } = await supabase.from(tableName).insert([row]).select();
            if (error) {
              console.error(`Supabase insert error for table ${tableName}:`, error.message || error);
              writeSqlInsert(tableName, row);
            } else {
              console.log(`Inserted into Supabase ${tableName} id?`, data && data[0] && data[0].id);
            }
          } catch (sex) {
            console.error('Supabase operation failed:', sex.message || sex);
            writeSqlInsert(tableName, row);
          }
        } else {
          writeSqlInsert(tableName, row);
        }
      }
      resolve();
    });
  });
}

(async () => {
  if (fs.existsSync(outSqlPath)) fs.unlinkSync(outSqlPath);
  const tasks = [
    { t: 'gallery', imgs: ['image_url'] },
    { t: 'hero_slides', imgs: ['image_url'] },
    { t: 'site_images', imgs: ['image_url'] },
    { t: 'events', imgs: ['image_url'] },
    { t: 'past_events', imgs: [] },
    { t: 'past_event_photos', imgs: ['image_url'] },
    { t: 'announcements', imgs: [] },
    { t: 'documents', imgs: ['file_url'] },
    { t: 'teacher_applications', imgs: ['resume_url'] },
    { t: 'admission_enquiries', imgs: [] },
    { t: 'contact_messages', imgs: [] },
    { t: 'gallery', imgs: ['image_url'] },
  ];

  for (const task of tasks) {
    await migrateTable(task.t, task.imgs);
  }

  console.log('Migration finished.');
  if (fs.existsSync(outSqlPath)) console.log('SQL file created at', outSqlPath);
  sqlite.close();
})();
