require('dotenv').config({ path: '../.env' });
const express = require('express');
// ensure there is always an admin username/password hash (used during removal of ERP)
if (!process.env.ADMIN_USERNAME) {
  // default to 'ias' if environment variable missing
  process.env.ADMIN_USERNAME = 'ias';
}
if (!process.env.ADMIN_PASSWORD_HASH) {
  // bcrypt hash for password 'admin' (generated once above)
  process.env.ADMIN_PASSWORD_HASH = '$2b$10$nswerg1HOlt3G.wSBhoxeOLuMcqpO8DJn2k4nqvJ0ubI.rsjes.Bm';
}


const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const sharp = require('sharp');
const cloudinary = require('cloudinary').v2;
const supabaseClient = require('./supabaseClient');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3004;

console.log(`Backend: Starting server on port ${PORT}`);

// Security middleware
if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        styleSrcElem: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https:"],
        frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com", "https://docs.google.com", "https://res.cloudinary.com"],
      },
    },
  }));
}
app.set('trust proxy', 1); // Trust first proxy for rate limiting

// CORS middleware
const corsOptions = {
  origin: true, // Allow all origins
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));


let limiter;
if (process.env.NODE_ENV === 'production') {
  limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  });
  app.use(limiter);
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Load uploads mapping (local filename -> cloudinary URL) if present
const uploadsMapPath = path.join(__dirname, 'uploads_map.json');
let uploadsMap = {};
if (fs.existsSync(uploadsMapPath)) {
  try {
    uploadsMap = JSON.parse(fs.readFileSync(uploadsMapPath, 'utf8')) || {};
    console.log('Loaded uploads map with', Object.keys(uploadsMap).length, 'entries');
  } catch (e) {
    console.warn('Failed to parse uploads_map.json, continuing without map');
  }
}

// Helper to find Cloudinary URL for a requested filename
const getCloudinaryUrl = (fn) => {
  if (!fn) return null;
  let url = uploadsMap[fn];
  if (!url) {
    const cleanFn = fn.toLowerCase().trim();
    const matchedKey = Object.keys(uploadsMap).find(k => {
      const kl = k.toLowerCase();
      return kl === cleanFn || kl.endsWith(cleanFn) || cleanFn.endsWith(kl) || kl.includes(cleanFn);
    });
    if (matchedKey) url = uploadsMap[matchedKey];
  }
  if (!url) return null;

  const isPdf = fn.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('.pdf');

  if (isPdf) {
    url = url.replace('/f_auto,q_auto/', '/');
    if (url.includes('/image/upload/') && !url.includes('/fl_inline/')) {
      url = url.replace('/image/upload/', '/image/upload/fl_inline/');
    }
  } else {
    if (url.includes('/upload/') && !url.includes('/f_auto,q_auto/')) {
      url = url.replace('/upload/', '/upload/f_auto,q_auto/');
    }
  }
  return url;
};

// Helper to locate local files in public/uploads, dist/uploads, or backend/uploads
const findLocalUploadFile = (fn) => {
  if (!fn) return null;
  const searchPaths = [
    path.join(__dirname, '..', 'public', 'uploads', fn),
    path.join(__dirname, '..', 'dist', 'uploads', fn),
    path.join(__dirname, 'uploads', fn),
    path.join(__dirname, '..', 'public', fn),
    path.join(__dirname, '..', 'src', 'assets', fn)
  ];
  for (const p of searchPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
};

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// PDF viewer and file serving routes (MUST BE AT THE TOP)
app.get('/view-image/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);

  // prefer cloudinary mapping
  const cloudUrl = getCloudinaryUrl(filename);
  if (!cloudUrl && !fs.existsSync(filePath)) {
    return res.status(404).send('Image not found.');
  }

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Indo American Gateway - ${filename}</title>
    <link rel="icon" type="image/png" href="/indo-logo.png" />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
      :root {
        --primary: hsl(215, 86%, 27%);
        --primary-light: hsl(215, 86%, 37%);
        --gold: hsl(45, 100%, 51%);
        --gold-dark: hsl(45, 100%, 41%);
        --bg: #051429;
      }
      * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
      body { 
        margin: 0; padding: 0; 
        font-family: 'Outfit', system-ui, sans-serif; 
        background: radial-gradient(at 0% 0%, hsla(215, 86%, 15%, 1) 0, transparent 50%), 
                    radial-gradient(at 100% 100%, hsla(45, 100%, 15%, 1) 0, transparent 50%), 
                    var(--bg);
        display: flex; flex-direction: column; 
        height: 100vh; color: white; overflow: hidden;
      }
      .header {
        position: relative;
        background: rgba(10, 61, 130, 0.4);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        padding: 0.8rem 2.5rem;
        display: flex; align-items: center; justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 100;
      }
      .brand { display: flex; align-items: center; gap: 1.2rem; }
      .logo { width: 42px; height: 42px; object-fit: contain; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2)); }
      .brand-text h1 { margin: 0; font-size: 1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: white; }
      .brand-text p { margin: 0; font-size: 0.6rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.15em; opacity: 0.9; }
      
      .actions { display: flex; gap: 0.8rem; }
      .btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        padding: 0.5rem 1.2rem;
        border-radius: 10px;
        font-size: 0.72rem;
        font-weight: 700;
        cursor: pointer;
        display: flex; align-items: center; gap: 0.6rem;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .btn:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
      .btn-gold { 
        background: linear-gradient(135deg, var(--gold), var(--gold-dark)); 
        color: #051429; 
        border: none;
        box-shadow: 0 4px 15px rgba(255, 193, 7, 0.25);
      }
      .btn-gold:hover { background: linear-gradient(135deg, #ffd54f, var(--gold)); box-shadow: 0 8px 25px rgba(255, 193, 7, 0.4); }

      .viewer-container {
        flex: 1;
        display: flex; align-items: center; justify-content: center;
        padding: 2.5rem;
        overflow: auto;
        animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1);
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      .image-card {
        background: white;
        padding: 10px;
        border-radius: 16px;
        box-shadow: 0 50px 100px -20px rgba(0,0,0,0.7), 0 30px 60px -30px rgba(0,0,0,0.7);
        max-width: fit-content;
      }
      .image-card img {
        display: block;
        max-width: 100%;
        max-height: 72vh;
        border-radius: 8px;
        border: 1px solid rgba(0,0,0,0.05);
      }

      .footer {
        padding: 0.8rem 2.5rem;
        background: rgba(0,0,0,0.3);
        backdrop-filter: blur(8px);
        border-top: 1px solid rgba(255,255,255,0.05);
        font-size: 0.6rem;
        color: rgba(255,255,255,0.4);
        display: flex; justify-content: space-between; align-items: center;
        font-weight: 500;
        letter-spacing: 0.05em;
      }

      @media (max-width: 640px) {
        .header { padding: 0.8rem 1rem; }
        .brand-text h1 { font-size: 0.85rem; }
        .btn span { display: none; }
        .viewer-container { padding: 1rem; }
      }

      @media print {
        .header, .footer { display: none; }
        body { background: white; }
        .viewer-container { padding: 0; background: white; }
        .image-card { box-shadow: none; padding: 0; }
      }
    </style>
  </head>
  <body>
    <header class="header">
      <div class="brand">
        <img src="/indo-logo.png" alt="IAS" class="logo">
        <div class="brand-text">
          <h1>Indo American School</h1>
          <p>Official Document Gateway</p>
        </div>
      </div>
      <div class="actions">
        <button class="btn" onclick="window.print()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></svg>
          <span>Print</span>
        </button>
        <a href="/uploads/${filename}" download="${filename}" class="btn btn-gold">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          <span>Get Copy</span>
        </a>
      </div>
    </header>

    <main class="viewer-container">
      <div class="image-card">
        <img src="${cloudUrl ? cloudUrl : '/uploads/' + encodeURIComponent(filename)}" alt="Document Content">
      </div>
    </main>

    <footer class="footer">
      <div>&copy; 2026 Indo American School. All rights reserved.</div>
      <div style="text-transform: uppercase; font-size: 0.55rem; opacity: 0.8;">IDENTIFIER: ${filename}</div>
    </footer>
  </body>
  </html>
  `;
  res.send(html);
});

app.get('/view-pdf/:filename', (req, res) => {
  const filename = req.params.filename;
  const cloudUrl = getCloudinaryUrl(filename);
  const localPath = findLocalUploadFile(filename);
  const pdfTargetUrl = cloudUrl ? cloudUrl : `/uploads/${encodeURIComponent(filename)}`;

  // Set security headers to allow embedding
  res.removeHeader('X-Frame-Options');
  res.setHeader('Content-Security-Policy', "default-src 'self' data: *; frame-src 'self' data: *; object-src 'self' data: *; img-src 'self' data: *; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;");
  res.setHeader('Access-Control-Allow-Origin', '*');

  const html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IAS Gateway | PDF - ${filename}</title>
    <link rel="icon" type="image/png" href="/indo-logo.png" />
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
    <style>
      :root {
        --primary: hsl(215, 86%, 27%);
        --primary-light: hsl(215, 86%, 37%);
        --gold: hsl(45, 100%, 51%);
        --gold-dark: hsl(45, 100%, 41%);
        --bg: #1e293b;
      }
      * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
      body { 
        margin: 0; padding: 0; 
        font-family: 'Outfit', system-ui, sans-serif; 
        background: #0f172a; 
        display: flex; flex-direction: column; 
        height: 100vh; overflow: hidden;
      }
      .header {
        position: relative;
        background: rgba(10, 61, 130, 0.4);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        padding: 0.8rem 2.5rem;
        display: flex; align-items: center; justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        z-index: 100;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      }
      .brand { display: flex; align-items: center; gap: 1.2rem; }
      .logo { width: 42px; height: 42px; object-fit: contain; filter: drop-shadow(0 0 8px rgba(255,255,255,0.2)); }
      .brand-text h1 { margin: 0; font-size: 1rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: white; }
      .brand-text p { margin: 0; font-size: 0.6rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: 0.15em; opacity: 0.9; }
      
      .actions { display: flex; gap: 0.8rem; }
      .btn {
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        color: white;
        padding: 0.5rem 1.2rem;
        border-radius: 10px;
        font-size: 0.72rem;
        font-weight: 700;
        cursor: pointer;
        display: flex; align-items: center; gap: 0.6rem;
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        text-decoration: none;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
      .btn:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
      .btn-gold { 
        background: linear-gradient(135deg, var(--gold), var(--gold-dark)); 
        color: #051429; 
        border: none;
        box-shadow: 0 4px 15px rgba(255, 193, 7, 0.25);
      }
      .btn-gold:hover { background: linear-gradient(135deg, #ffd54f, var(--gold)); box-shadow: 0 8px 25px rgba(255, 193, 7, 0.4); }

      .viewer-container { flex: 1; background: #334155; position: relative; animation: fadeIn 0.6s ease-out; }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      iframe { width: 100%; height: 100%; border: none; background: #525659; }

      .footer {
        padding: 0.6rem 2.5rem;
        background: #020617;
        color: rgba(255,255,255,0.3);
        font-size: 0.55rem;
        text-align: center;
        border-top: 1px solid rgba(255,255,255,0.05);
        letter-spacing: 0.02em;
      }

      @media (max-width: 640px) {
        .header { padding: 0.8rem 1rem; }
        .brand-text h1 { font-size: 0.85rem; }
        .brand-text p { display: none; }
        .btn span { display: none; }
      }
    </style>
  </head>
  <body>
    <header class="header">
      <div class="brand">
        <img src="/indo-logo.png" alt="IAS" class="logo">
        <div class="brand-text">
          <h1>Indo American School</h1>
          <p>Premium Document Viewer</p>
        </div>
      </div>
      <div class="actions">
        <button class="btn btn-gold" onclick="window.open('${pdfTargetUrl}', '_blank')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
          <span>Open Original</span>
        </button>
      </div>
    </header>
      <main class="viewer-container">
      <iframe src="${pdfTargetUrl}#toolbar=1" title="PDF Viewer"></iframe>
    </main>
    <footer class="footer">
      PDF IDENTIFIER: ${filename} | &copy; 2026 Indo American School. All rights reserved.
    </footer>
  </body>
  </html>
  `;
  res.send(html);
});

app.get('/uploads/:filename', async (req, res) => {
  const filename = req.params.filename;
  console.log(`[file-server] Requested: ${filename}`);

  // 1. Check Cloudinary URL mapping first
  const cloudUrl = getCloudinaryUrl(filename);
  if (cloudUrl) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.redirect(301, cloudUrl);
  }

  // 2. Check local files in public/uploads, dist/uploads, or src/assets
  const filePath = findLocalUploadFile(filename);
  if (filePath) {
    res.removeHeader('X-Frame-Options');
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (filename.toLowerCase().endsWith('.pdf')) {
      res.type('application/pdf');
      res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
    }
    return res.sendFile(filePath);
  }

  // 3. Fallback SVG if file does not exist anywhere
  res.setHeader('Content-Type', 'image/svg+xml');
  return res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#1a365d"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="18">Indo American School</text></svg>`);
});

// Admin login route
app.post('/api/admin/login', async (req, res) => {
  console.log('Login request received:', req.body, req.headers);

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  // normalize for case-insensitive comparison
  const providedUser = username.trim().toLowerCase();
  const expectedUser = (process.env.ADMIN_USERNAME || '').trim().toLowerCase();

  console.log('Login attempt:', { providedUser, expectedUser, hasHash: !!process.env.ADMIN_PASSWORD_HASH });

  const isMatch = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  console.log('Password match:', isMatch);

  if (providedUser === expectedUser && isMatch) {
    const token = jwt.sign({ username: process.env.ADMIN_USERNAME || providedUser, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Serve static files from public and dist
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../dist')));



// Initialize Database Driver (Pure Supabase with Hybrid Memory Cache for 100% Reliability)
console.log('Database Driver: Using Supabase mode with Hybrid Memory Store');

const memoryStore = {
  announcements: [],
  events: [],
  hero_slides: [],
  site_images: [],
  gallery: [],
  documents: [],
  teacher_applications: [],
  admission_enquiries: [],
  contact_messages: [],
  past_events: []
};

const db = {
  all: async (sql, params, callback) => {
    const cb = typeof params === 'function' ? params : callback;
    const actualParams = Array.isArray(params) ? params : [];
    const tableMatch = sql.match(/FROM\s+([a-zA-Z0-9_]+)/i);
    const tableName = tableMatch ? tableMatch[1].toLowerCase() : null;

    try {
      const supabase = supabaseClient.getClient();
      if (supabase && tableName) {
        let query = supabase.from(tableName).select('*');

        if (sql.includes('WHERE') && actualParams.length > 0) {
          const whereMatch = sql.match(/WHERE\s+([a-zA-Z0-9_]+)\s*=\s*\?/i);
          if (whereMatch) {
            query = query.eq(whereMatch[1], actualParams[0]);
          }
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          if (typeof cb === 'function') cb(null, data);
          return;
        }
      }
    } catch (err) {
      console.warn(`Supabase fetch notice for ${tableName}:`, err.message || err);
    }

    // Fallback to in-memory store so admin panel and UI never fail
    let rows = (tableName && memoryStore[tableName]) ? [...memoryStore[tableName]] : [];
    
    // Simple in-memory filtering if WHERE param exists
    if (sql.includes('WHERE') && actualParams.length > 0) {
      const whereMatch = sql.match(/WHERE\s+([a-zA-Z0-9_]+)\s*=\s*\?/i);
      if (whereMatch) {
        const col = whereMatch[1];
        rows = rows.filter(r => String(r[col]) === String(actualParams[0]));
      }
    }

    if (typeof cb === 'function') cb(null, rows);
  },

  get: async (sql, params, callback) => {
    const cb = typeof params === 'function' ? params : callback;
    db.all(sql, params, (err, rows) => {
      if (err) return typeof cb === 'function' ? cb(null, null) : null;
      if (typeof cb === 'function') cb(null, rows && rows.length > 0 ? rows[0] : null);
    });
  },

  run: async (sql, params, callback) => {
    const cb = typeof params === 'function' ? params : callback;
    const actualParams = Array.isArray(params) ? params : [];
    const sqlUpper = sql.trim().toUpperCase();

    // Ignore DDL statements (CREATE TABLE, ALTER TABLE)
    if (sqlUpper.startsWith('CREATE ') || sqlUpper.startsWith('ALTER ')) {
      if (typeof cb === 'function') cb.call({ lastID: 0, changes: 0 }, null);
      return;
    }

    if (sqlUpper.startsWith('INSERT INTO')) {
      const tableMatch = sql.match(/INSERT INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)/i);
      if (tableMatch) {
        const tableName = tableMatch[1].toLowerCase();
        const columns = tableMatch[2].split(',').map(c => c.trim());
        const record = { id: Date.now(), created_at: new Date().toISOString() };
        columns.forEach((col, idx) => {
          record[col] = actualParams[idx];
        });

        if (!memoryStore[tableName]) memoryStore[tableName] = [];
        memoryStore[tableName].unshift(record);

        // Async try insert to Supabase
        const supabase = supabaseClient.getClient();
        if (supabase) {
          supabase.from(tableName).insert([record]).then(({ error }) => {
            if (error) console.warn(`Supabase async insert note for ${tableName}:`, error.message);
          }).catch(e => console.warn(`Supabase async insert error on ${tableName}:`, e.message));
        }

        if (typeof cb === 'function') cb.call({ lastID: record.id, changes: 1 }, null);
        return;
      }
    } else if (sqlUpper.startsWith('UPDATE')) {
      const tableMatch = sql.match(/UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+(.+)\s+WHERE\s+([a-zA-Z0-9_]+)\s*=\s*\?/i);
      if (tableMatch) {
        const tableName = tableMatch[1].toLowerCase();
        const setClause = tableMatch[2];
        const whereCol = tableMatch[3];
        const whereVal = actualParams[actualParams.length - 1];

        const setCols = setClause.split(',').map(s => s.split('=')[0].trim());
        const updateFields = {};
        setCols.forEach((col, idx) => {
          if (col !== 'updated_at') {
            updateFields[col] = actualParams[idx];
          }
        });

        if (memoryStore[tableName]) {
          const item = memoryStore[tableName].find(r => String(r[whereCol]) === String(whereVal));
          if (item) Object.assign(item, updateFields);
        }

        // Async try update to Supabase
        const supabase = supabaseClient.getClient();
        if (supabase) {
          supabase.from(tableName).update(updateFields).eq(whereCol, whereVal).then(({ error }) => {
            if (error) console.warn(`Supabase async update note for ${tableName}:`, error.message);
          }).catch(e => console.warn(`Supabase async update error on ${tableName}:`, e.message));
        }

        if (typeof cb === 'function') cb.call({ changes: 1 }, null);
        return;
      }
    } else if (sqlUpper.startsWith('DELETE FROM')) {
      const tableMatch = sql.match(/DELETE FROM\s+([a-zA-Z0-9_]+)\s+WHERE\s+([a-zA-Z0-9_]+)\s*=\s*\?/i);
      if (tableMatch) {
        const tableName = tableMatch[1].toLowerCase();
        const whereCol = tableMatch[2];
        const whereVal = actualParams[0];

        if (memoryStore[tableName]) {
          memoryStore[tableName] = memoryStore[tableName].filter(r => String(r[whereCol]) !== String(whereVal));
        }

        // Async try delete to Supabase
        const supabase = supabaseClient.getClient();
        if (supabase) {
          supabase.from(tableName).delete().eq(whereCol, whereVal).then(({ error }) => {
            if (error) console.warn(`Supabase async delete note for ${tableName}:`, error.message);
          }).catch(e => console.warn(`Supabase async delete error on ${tableName}:`, e.message));
        }

        if (typeof cb === 'function') cb.call({ changes: 1 }, null);
        return;
      }
    }

    if (typeof cb === 'function') cb.call({ lastID: 1, changes: 1 }, null);
  },

  prepare: (sql) => {
    return {
      run: (...args) => {
        const callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
        db.run(sql, args, callback);
      },
      finalize: (cb) => {
        if (typeof cb === 'function') cb(null);
      }
    };
  }
};

if (db && typeof db.run === 'function') {
  db.serialize = (cb) => cb(); // Mock serialize for compatibility
  // ... rest of the table definitions ...
    // Announcements table
    db.run(`CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT DEFAULT 'general',
      urgent BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Events table
    db.run(`CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      time TEXT,
      venue TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Past Events table
    db.run(`CREATE TABLE IF NOT EXISTS past_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Past Event Photos table
    db.run(`CREATE TABLE IF NOT EXISTS past_event_photos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      FOREIGN KEY (event_id) REFERENCES past_events(id)
    )`);

    // Gallery table
    db.run(`CREATE TABLE IF NOT EXISTS gallery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      year TEXT DEFAULT '${new Date().getFullYear()}',
      image_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Admission Enquiries table
    db.run(`CREATE TABLE IF NOT EXISTS admission_enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_name TEXT NOT NULL,
      parent_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      class_applied TEXT NOT NULL,
      additional_info TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Contact Messages table
    db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT,
      message TEXT NOT NULL,
      read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Documents table
    db.run(`CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT,
      size TEXT,
      lastUpdated TEXT,
      required BOOLEAN DEFAULT 0,
      file_url TEXT
    )`);

    // Teacher Applications table
    db.run(`CREATE TABLE IF NOT EXISTS teacher_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      post TEXT NOT NULL,
      subject TEXT,
      qualification TEXT NOT NULL,
      experience TEXT NOT NULL,
      resume_url TEXT,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Fee Structures table
    db.run(`CREATE TABLE IF NOT EXISTS fee_structures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class TEXT NOT NULL UNIQUE,
      total_amount REAL NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Fee Payments table
    db.run(`CREATE TABLE IF NOT EXISTS fee_payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      amount_paid REAL NOT NULL,
      payment_date DATE DEFAULT CURRENT_DATE,
      payment_month TEXT,
      transaction_id TEXT,
      receipt_url TEXT,
      remarks TEXT,
      FOREIGN KEY (student_id) REFERENCES profiles(id)
    )`);

    // Timetables table
    db.run(`CREATE TABLE IF NOT EXISTS timetables (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class TEXT NOT NULL,
      section TEXT NOT NULL,
      day TEXT NOT NULL,
      period INTEGER NOT NULL,
      subject TEXT NOT NULL,
      teacher_id INTEGER,
      start_time TEXT,
      end_time TEXT,
      FOREIGN KEY (teacher_id) REFERENCES profiles(id)
    )`);

    // Add subject and post columns if they don't exist (for existing tables)
    db.run(`ALTER TABLE teacher_applications ADD COLUMN subject TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding subject column:', err.message);
      }
    });
    db.run(`ALTER TABLE teacher_applications ADD COLUMN post TEXT`, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error adding post column:', err.message);
      }
    });

    // Assignments table
    db.run(`CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      teacher_id INTEGER NOT NULL,
      class TEXT NOT NULL,
      section TEXT NOT NULL,
      subject TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      file_url TEXT NOT NULL,
      due_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES profiles(id)
    )`);

    // Datesheets table
    db.run(`CREATE TABLE IF NOT EXISTS datesheets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class TEXT NOT NULL,
      exam_type TEXT NOT NULL,
      file_url TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Site Images table (admin-managed static site images)
    db.run(`CREATE TABLE IF NOT EXISTS site_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slot_key TEXT NOT NULL UNIQUE,
      label TEXT NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Hero Slides table (admin-managed dynamic hero slider)
    db.run(`CREATE TABLE IF NOT EXISTS hero_slides (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      accent TEXT,
      image_url TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Add max_marks column if it doesn't exist
    db.run(`ALTER TABLE marks ADD COLUMN max_marks REAL`, (err) => {
      // ignore errors if the column already exists or table is missing
      if (err && !err.message.includes('duplicate column name') && !err.message.includes('no such table')) {
        console.error('Error adding max_marks column:', err.message);
      }
    });
}

// Configure multer for file uploads with security
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check the route to apply different filtering logic if needed
    // However, the broad filter below is generally safe as specific routes add extra checks.
    if (file.mimetype.startsWith('image/') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images, PDFs, and Word documents are allowed.'), false);
    }
  }
});

// Configure Cloudinary if env provided
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

// Initialize Supabase client (if env provided)
const supabase = supabaseClient.getClient();
if (supabase) {
  console.log('Supabase client initialized');
} else {
  console.log('Supabase not configured (no SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY found)');
}

// expose supabase client on app for future handlers
app.set('supabase', supabase);

// Helper to upload a buffer to Cloudinary. Returns secure_url string.
async function uploadToCloudinary(buffer, filename, mimetype, folder) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return null;
  const base64 = buffer.toString('base64');
  const dataUri = `data:${mimetype};base64,${base64}`;
  const opts = {
    folder: folder || 'ias',
    public_id: filename.replace(/\.[^.]+$/, ''),
    overwrite: true,
    resource_type: 'auto',
  };
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(dataUri, opts, (err, res) => {
      if (err) return reject(err);
      resolve(res.secure_url || res.url);
    });
  });
}

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ERP router and login removed
app.set('db', db);

// debug: print registered route paths
if (app._router) {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push(middleware.route.path);
    } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push(handler.route.path);
        }
      });
    }
  });
  console.log('Registered routes:', routes);
}

// Admin login route (defined before rate limiter)

// API Routes

// Announcements
app.get('/api/announcements', (req, res) => {
  console.log('GET /api/announcements requested');
  db.all('SELECT * FROM announcements ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('DB error in announcements:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Returning announcements:', rows.length);
    res.json(rows);
  });
});

app.post('/api/announcements', authenticateToken, (req, res) => {
  const { title, description, type, urgent } = req.body;
  db.run('INSERT INTO announcements (title, description, type, urgent) VALUES (?, ?, ?, ?)',
    [title, description, type, urgent ? 1 : 0], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

app.put('/api/announcements/:id', authenticateToken, (req, res) => {
  const { title, description, type, urgent } = req.body;
  db.run('UPDATE announcements SET title = ?, description = ?, type = ?, urgent = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, description, type, urgent ? 1 : 0, req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    });
});

app.delete('/api/announcements/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM announcements WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Events
app.get('/api/events', (req, res) => {
  db.all('SELECT * FROM events ORDER BY date ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/events', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, description, date, time, venue } = req.body;
  let image_url = null;

  if (req.file) {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const webpFilename = `${uniqueSuffix}.webp`;
      const processedBuffer = await sharp(req.file.buffer).webp({ quality: 80 }).toBuffer();

      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const url = await uploadToCloudinary(processedBuffer, webpFilename, 'image/webp', 'ias/events');
        image_url = url;
      } else {
        const webpPath = path.join(uploadsDir, webpFilename);
        await sharp(req.file.buffer).webp({ quality: 80 }).toFile(webpPath);
        image_url = `/uploads/${webpFilename}`;
      }
    } catch (error) {
      console.error('Error processing event image:', error);
      return res.status(500).json({ error: 'Image processing failed.' });
    }
  }

  db.run('INSERT INTO events (title, description, date, time, venue, image_url) VALUES (?, ?, ?, ?, ?, ?)',
    [title, description, date, time, venue, image_url], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    });
});

app.put('/api/events/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, description, date, time, venue } = req.body;
  let imageUrl = req.body.image_url; // Keep existing image if no new one is uploaded

  if (req.file) {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const webpFilename = `${uniqueSuffix}.webp`;
      const processedBuffer = await sharp(req.file.buffer).webp({ quality: 80 }).toBuffer();

      if (process.env.CLOUDINARY_CLOUD_NAME) {
        const url = await uploadToCloudinary(processedBuffer, webpFilename, 'image/webp', 'ias/events');
        imageUrl = url;
      } else {
        const webpPath = path.join(uploadsDir, webpFilename);
        await sharp(req.file.buffer).webp({ quality: 80 }).toFile(webpPath);
        imageUrl = `/uploads/${webpFilename}`;
      }
    } catch (error) {
      console.error('Error processing event image:', error);
      return res.status(500).json({ error: 'Image processing failed.' });
    }
  }

  db.run('UPDATE events SET title = ?, description = ?, date = ?, time = ?, venue = ?, image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [title, description, date, time, venue, imageUrl, req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    });
});

app.delete('/api/events/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM events WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Past Events
app.get('/api/past-events', (req, res) => {
  db.all("SELECT * FROM past_events WHERE date < date('now') ORDER BY date DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const pastEvents = rows;
    const promises = pastEvents.map(event => {
      return new Promise((resolve, reject) => {
        db.all('SELECT image_url FROM past_event_photos WHERE event_id = ?', [event.id], (err, photos) => {
          if (err) return reject(err);
          event.photos = photos;
          resolve();
        });
      });
    });
    Promise.all(promises)
      .then(() => res.json(pastEvents))
      .catch(err => res.status(500).json({ error: err.message }));
  });
});

app.post('/api/past-events', authenticateToken, upload.array('photos', 10), async (req, res) => {
  const { title, description, date } = req.body;
  db.run('INSERT INTO past_events (title, description, date) VALUES (?, ?, ?)',
    [title, description, date], async function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const eventId = this.lastID;
      if (req.files && req.files.length > 0) {
        const photoPromises = req.files.map(async (file) => {
          try {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const webpFilename = `${uniqueSuffix}.webp`;
            const processedBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();

            let imageUrl;
            if (process.env.CLOUDINARY_CLOUD_NAME) {
              imageUrl = await uploadToCloudinary(processedBuffer, webpFilename, 'image/webp', 'ias/past_events');
            } else {
              const webpPath = path.join(uploadsDir, webpFilename);
              await sharp(file.buffer).webp({ quality: 80 }).toFile(webpPath);
              imageUrl = `/uploads/${webpFilename}`;
            }
            return new Promise((resolve, reject) => {
              db.run('INSERT INTO past_event_photos (event_id, image_url) VALUES (?, ?)', [eventId, imageUrl], (err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          } catch (error) {
            console.error('Error processing past event photo:', error);
            throw new Error('Image processing failed.');
          }
        });
        try {
          await Promise.all(photoPromises);
          res.json({ id: eventId });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      } else {
        res.json({ id: eventId });
      }
    });
});

app.put('/api/past-events/:id', authenticateToken, upload.array('photos', 10), async (req, res) => {
  const { title, description, date } = req.body;
  const eventId = req.params.id;

  db.run('UPDATE past_events SET title = ?, description = ?, date = ? WHERE id = ?',
    [title, description, date, eventId], async function (err) {
      if (err) return res.status(500).json({ error: err.message });

      if (req.files && req.files.length > 0) {
        // First, delete old photos if you want to replace them
        db.run('DELETE FROM past_event_photos WHERE event_id = ?', [eventId], async (err) => {
          if (err) return res.status(500).json({ error: err.message });

          // Then, insert new photos
          const photoPromises = req.files.map(async (file) => {
            try {
              const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
              const webpFilename = `${uniqueSuffix}.webp`;
              const processedBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();

              let imageUrl;
              if (process.env.CLOUDINARY_CLOUD_NAME) {
                imageUrl = await uploadToCloudinary(processedBuffer, webpFilename, 'image/webp', 'ias/past_events');
              } else {
                const webpPath = path.join(uploadsDir, webpFilename);
                await sharp(file.buffer).webp({ quality: 80 }).toFile(webpPath);
                imageUrl = `/uploads/${webpFilename}`;
              }
              return new Promise((resolve, reject) => {
                db.run('INSERT INTO past_event_photos (event_id, image_url) VALUES (?, ?)', [eventId, imageUrl], (err) => {
                  if (err) return reject(err);
                  resolve();
                });
              });
            } catch (error) {
              console.error('Error processing past event photo:', error);
              throw new Error('Image processing failed.');
            }
          });

          try {
            await Promise.all(photoPromises);
            res.json({ id: eventId });
          } catch (error) {
            res.status(500).json({ error: error.message });
          }
        });
      } else {
        res.json({ changes: this.changes });
      }
    });
});


app.delete('/api/past-events/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM past_events WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});


// Gallery
app.get('/api/gallery', (req, res) => {
  db.all('SELECT * FROM gallery ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching gallery:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Gallery images count:', rows.length);
    res.json(rows);
  });
});

// Documents (public list + admin CRUD)
app.get('/api/documents', (req, res) => {
  db.all('SELECT * FROM documents ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('Error fetching documents:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/documents', authenticateToken, (req, res) => {
  const { category, title, description, type, size, lastUpdated, required, file_url } = req.body;
  db.run(
    'INSERT INTO documents (category, title, description, type, size, lastUpdated, required, file_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [category, title, description, type, size, lastUpdated, required ? 1 : 0, file_url],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.put('/api/documents/:id', authenticateToken, (req, res) => {
  const { category, title, description, type, size, lastUpdated, required, file_url } = req.body;
  db.run(
    'UPDATE documents SET category = ?, title = ?, description = ?, type = ?, size = ?, lastUpdated = ?, required = ?, file_url = ? WHERE id = ?',
    [category, title, description, type, size, lastUpdated, required ? 1 : 0, file_url, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

app.delete('/api/documents/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM documents WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

app.post('/api/gallery', authenticateToken, upload.array('images', 10), async (req, res) => {
  const { title, category, year } = req.body;

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'Images are required' });
  }

  const insertPromises = req.files.map(async (file, index) => {
    console.log(`Processing image ${index + 1}/${req.files.length}: ${file.originalname}, size: ${file.size} bytes`);
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const webpFilename = `${uniqueSuffix}.webp`;
      const webpPath = path.join(uploadsDir, webpFilename);

      console.log(`Converting ${file.originalname} to ${webpFilename}`);
      let image_url;
      try {
        const processedBuffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          image_url = await uploadToCloudinary(processedBuffer, webpFilename, 'image/webp', 'ias/gallery');
        } else {
          await sharp(file.buffer).webp({ quality: 80 }).toFile(webpPath);
          image_url = `/uploads/${webpFilename}`;
        }
      } catch (sharpError) {
        console.log(`Sharp conversion failed for ${file.originalname}:`, sharpError.message);
        if (process.env.CLOUDINARY_CLOUD_NAME) {
          // upload original file buffer to Cloudinary as fallback
          try {
            image_url = await uploadToCloudinary(file.buffer, `${uniqueSuffix}-${file.originalname}`, file.mimetype || 'application/octet-stream', 'ias/gallery');
          } catch (cloudErr) {
            console.error('Cloudinary fallback upload failed:', cloudErr.message);
            const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
            const originalFilename = `${uniqueSuffix}-${sanitizedName}`;
            const originalPath = path.join(uploadsDir, originalFilename);
            fs.writeFileSync(originalPath, file.buffer);
            image_url = `/uploads/${originalFilename}`;
          }
        } else {
          const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
          const originalFilename = `${uniqueSuffix}-${sanitizedName}`;
          const originalPath = path.join(uploadsDir, originalFilename);
          fs.writeFileSync(originalPath, file.buffer);
          image_url = `/uploads/${originalFilename}`;
        }
      }
      console.log(`Saved ${webpFilename}, inserting into DB`);
      return new Promise((resolve, reject) => {
        db.run('INSERT INTO gallery (title, category, year, image_url) VALUES (?, ?, ?, ?)',
          [title || file.originalname, category || 'general', year || new Date().getFullYear().toString(), image_url], function (err) {
            if (err) {
              console.error(`DB insert error for ${file.originalname}:`, err.message);
              return reject(err);
            }
            console.log(`Inserted ${file.originalname} with ID ${this.lastID}`);
            resolve(this.lastID);
          });
      });
    } catch (error) {
      console.error(`Error processing gallery image ${file.originalname}:`, error.message);
      throw new Error(`Image processing failed for ${file.originalname}: ${error.message}`);
    }
  });

  try {
    const successfulInserts = [];
    const failedInserts = [];

    // Process images sequentially to avoid memory issues
    for (let i = 0; i < insertPromises.length; i++) {
      try {
        const result = await insertPromises[i];
        successfulInserts.push(result);
        console.log(`Successfully processed image ${i + 1}`);
      } catch (error) {
        failedInserts.push({ index: i, reason: error.message });
        console.error(`Failed to process image ${i + 1}:`, error.message);
      }
    }

    if (successfulInserts.length === 0) {
      res.status(500).json({ error: 'All images failed to process.', failed: failedInserts });
    } else {
      res.json({
        ids: successfulInserts,
        message: `${successfulInserts.length} images added successfully. ${failedInserts.length} failed.`,
        failed: failedInserts
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/gallery/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM gallery WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Admission Enquiries
app.get('/api/admission-enquiries', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  db.all('SELECT * FROM admission_enquiries ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/admission-enquiries', [
  body('student_name').trim().isLength({ min: 2, max: 150 }).escape(),
  body('parent_name').trim().isLength({ min: 2, max: 150 }).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 10, max: 20 }).escape(),
  body('class_applied').trim().isLength({ min: 1, max: 50 }).escape(),
  body('additional_info').optional().trim().isLength({ max: 1000 }).escape(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { student_name, parent_name, email, phone, class_applied, additional_info } = req.body;
  db.run('INSERT INTO admission_enquiries (student_name, parent_name, email, phone, class_applied, additional_info) VALUES (?, ?, ?, ?, ?, ?)',
    [student_name, parent_name, email, phone, class_applied, additional_info], function (err) {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      res.json({ id: this.lastID });
    });
});

app.put('/api/admission-enquiries/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  db.run('UPDATE admission_enquiries SET status = ? WHERE id = ?',
    [status, req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    });
});

app.delete('/api/admission-enquiries/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM admission_enquiries WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Contact Messages
app.get('/api/contact-messages', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  db.all('SELECT * FROM contact_messages ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/contact-messages', [
  body('name').trim().isLength({ min: 2, max: 150 }).escape(),
  body('email').trim().isEmail().normalizeEmail(),
  body('phone').optional().trim().isLength({ min: 10, max: 20 }).escape(),
  body('subject').trim().isLength({ min: 1, max: 200 }).escape(),
  body('message').trim().isLength({ min: 10, max: 2000 }).escape(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, subject, message } = req.body;
  db.run('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone, subject, message], function (err) {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      res.json({ id: this.lastID });
    });
});

app.put('/api/contact-messages/:id', authenticateToken, (req, res) => {
  const { read } = req.body;
  db.run('UPDATE contact_messages SET read = ? WHERE id = ?',
    [read ? 1 : 0, req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    });
});

app.delete('/api/contact-messages/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM contact_messages WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Teacher Applications
app.get('/api/teacher-applications', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
  console.log('GET /api/teacher-applications requested');
  db.all('SELECT * FROM teacher_applications ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error('DB error:', err.message);
      return res.status(500).json({ error: err.message });
    }
    console.log('Returning rows:', rows.length);
    res.json(rows);
  });
});

app.post('/api/teacher-applications', upload.single('resume'), [
  body('name').isLength({ min: 2, max: 100 }).trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('phone').isLength({ min: 6, max: 15 }).trim().escape(),
  body('post').isIn(['PGT', 'TGT', 'PRT', 'Librarian', 'Counselor']).trim().escape(),
  body('subject').isLength({ min: 2, max: 100 }).trim().escape(),
  body('qualification').optional().isLength({ max: 200 }).trim().escape(),
  body('experience').optional().isLength({ max: 500 }).trim().escape(),
], async (req, res) => {
  console.log('Received teacher application submission:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, phone, post, qualification, experience, subject } = req.body;
  const safeQualification = qualification || "";
  const safeExperience = experience || "";
  const safePost = post || "";
  let resume_url = null;

  if (req.file) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = `${uniqueSuffix}-${req.file.originalname}`;
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const url = await uploadToCloudinary(req.file.buffer, filename, req.file.mimetype || 'application/octet-stream', 'ias/resumes');
        resume_url = url;
      } catch (err) {
        console.error('Cloudinary upload failed for resume, falling back to local save:', err.message);
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, req.file.buffer);
        resume_url = `/uploads/${filename}`;
      }
    } else {
      const filePath = path.join(uploadsDir, filename);
      fs.writeFileSync(filePath, req.file.buffer);
      resume_url = `/uploads/${filename}`;
    }
  }

  console.log('Inserting into DB:', { name, email, phone, post: safePost, qualification: safeQualification, experience: safeExperience, subject, resume_url });
  db.run('INSERT INTO teacher_applications (name, email, phone, post, qualification, experience, subject, resume_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [name, email, phone, safePost, safeQualification, safeExperience, subject, resume_url], function (err) {
      if (err) {
        console.error('DB insert error:', err.message);
        return res.status(500).json({ error: 'Internal server error' });
      }
      console.log('Inserted with id:', this.lastID);
      res.json({ id: this.lastID });
    });
});

app.put('/api/teacher-applications/:id', authenticateToken, (req, res) => {
  const { status } = req.body;
  db.run('UPDATE teacher_applications SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [status, req.params.id], function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    });
});

app.delete('/api/teacher-applications/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM teacher_applications WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// ============ Site Images Management ============

// Default image slots to seed
const DEFAULT_IMAGE_SLOTS = [
  { slot_key: 'hero_slide_1', label: 'Hero Slide 1 - Main Building', category: 'Hero Slides' },
  { slot_key: 'hero_slide_2', label: 'Hero Slide 2 - World Education', category: 'Hero Slides' },
  { slot_key: 'hero_slide_3', label: 'Hero Slide 3 - Sports', category: 'Hero Slides' },
  { slot_key: 'hero_slide_4', label: 'Hero Slide 4 - Library', category: 'Hero Slides' },
  { slot_key: 'hero_slide_5', label: 'Hero Slide 5 - Cultural', category: 'Hero Slides' },
  { slot_key: 'hero_slide_6', label: 'Hero Slide 6 - Library Resources', category: 'Hero Slides' },
  { slot_key: 'about_image_1', label: 'About Section — Large Left Image (tall, takes left half)', category: 'About Section' },
  { slot_key: 'about_image_2', label: 'About Section — Top Right Square Image', category: 'About Section' },
  { slot_key: 'about_image_3', label: 'About Section — Bottom Right Square Image', category: 'About Section' },
];

// GET all site images (public)
app.get('/api/site-images', (req, res) => {
  db.all('SELECT * FROM site_images ORDER BY category, slot_key', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// POST seed default slots (admin only)
app.post('/api/site-images/seed', authenticateToken, (req, res) => {
  const insertStmt = db.prepare(
    'INSERT OR IGNORE INTO site_images (slot_key, label, category, image_url) VALUES (?, ?, ?, ?)'
  );
  const updateStmt = db.prepare(
    'UPDATE site_images SET label = ?, category = ? WHERE slot_key = ?'
  );
  DEFAULT_IMAGE_SLOTS.forEach(slot => {
    insertStmt.run(slot.slot_key, slot.label, slot.category, '');
    updateStmt.run(slot.label, slot.category, slot.slot_key);
  });
  insertStmt.finalize();
  updateStmt.finalize((err) => {
    if (err) return res.status(500).json({ error: err.message });
    db.all('SELECT * FROM site_images ORDER BY category, slot_key', [], (err2, rows) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json(rows);
    });
  });
});

// PUT update a site image by slot key (admin only, file upload)
app.put('/api/site-images/:key', authenticateToken, upload.single('image'), async (req, res) => {
  const slotKey = req.params.key;

  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const webpFilename = `site-${slotKey}-${uniqueSuffix}.webp`;
    const processedBuffer = await sharp(req.file.buffer).webp({ quality: 85 }).toBuffer();

    let imageUrl;
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      imageUrl = await uploadToCloudinary(processedBuffer, webpFilename, 'image/webp', `ias/site_images/${slotKey}`);
    } else {
      const webpPath = path.join(uploadsDir, webpFilename);
      await sharp(req.file.buffer).webp({ quality: 85 }).toFile(webpPath);
      imageUrl = `/uploads/${webpFilename}`;
    }

    // Check if slot exists
    db.get('SELECT id FROM site_images WHERE slot_key = ?', [slotKey], (err, row) => {
      if (err) return res.status(500).json({ error: err.message });

      if (row) {
        // Update existing
        db.run(
          'UPDATE site_images SET image_url = ?, updated_at = CURRENT_TIMESTAMP WHERE slot_key = ?',
          [imageUrl, slotKey],
          function (err2) {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ slot_key: slotKey, image_url: imageUrl });
          }
        );
      } else {
        // Find label from defaults or use key
        const defaultSlot = DEFAULT_IMAGE_SLOTS.find(s => s.slot_key === slotKey);
        const label = defaultSlot ? defaultSlot.label : slotKey;
        const category = defaultSlot ? defaultSlot.category : 'Other';
        db.run(
          'INSERT INTO site_images (slot_key, label, category, image_url) VALUES (?, ?, ?, ?)',
          [slotKey, label, category, imageUrl],
          function (err2) {
            if (err2) return res.status(500).json({ error: err2.message });
            res.json({ slot_key: slotKey, image_url: imageUrl });
          }
        );
      }
    });
  } catch (error) {
    console.error('Error processing site image:', error);
    res.status(500).json({ error: 'Image processing failed.' });
  }
});

// POST add a new site image slot (admin only, file upload)
app.post('/api/site-images', authenticateToken, upload.single('image'), async (req, res) => {
  const { label, category } = req.body;
  if (!req.file || !label || !category) {
    return res.status(400).json({ error: 'Image, label, and category are required' });
  }
  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const slotKey = `custom_${uniqueSuffix}`;
    const webpFilename = `site-${slotKey}.webp`;
    const processedBuffer = await sharp(req.file.buffer).webp({ quality: 85 }).toBuffer();
    let imageUrl;
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      imageUrl = await uploadToCloudinary(processedBuffer, webpFilename, 'image/webp', `ias/site_images/${slotKey}`);
    } else {
      const webpPath = path.join(uploadsDir, webpFilename);
      await sharp(req.file.buffer).webp({ quality: 85 }).toFile(webpPath);
      imageUrl = `/uploads/${webpFilename}`;
    }
    db.run(
      'INSERT INTO site_images (slot_key, label, category, image_url) VALUES (?, ?, ?, ?)',
      [slotKey, label, category, imageUrl],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, slot_key: slotKey, image_url: imageUrl });
      }
    );
  } catch (error) {
    console.error('Error adding site image:', error);
    res.status(500).json({ error: 'Image processing failed.' });
  }
});

// DELETE a site image slot (admin only)
app.delete('/api/site-images/:key', authenticateToken, (req, res) => {
  db.run('DELETE FROM site_images WHERE slot_key = ?', [req.params.key], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// ============ Hero Slides Management ============

// GET all hero slides (public)
app.get('/api/hero-slides', (req, res) => {
  db.all('SELECT * FROM hero_slides ORDER BY sort_order ASC, id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows || []);
  });
});

// POST add a new hero slide (admin only, file upload)
app.post('/api/hero-slides', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, subtitle, description, accent, sort_order } = req.body;
  if (!req.file || !title) {
    return res.status(400).json({ error: 'Image and title are required' });
  }
  try {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const webpFilename = `hero-${uniqueSuffix}.webp`;
    const processedBuffer = await sharp(req.file.buffer).webp({ quality: 85 }).toBuffer();
    let imageUrl;
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      imageUrl = await uploadToCloudinary(processedBuffer, webpFilename, 'image/webp', 'ias/hero_slides');
    } else {
      const webpPath = path.join(uploadsDir, webpFilename);
      await sharp(req.file.buffer).webp({ quality: 85 }).toFile(webpPath);
      imageUrl = `/uploads/${webpFilename}`;
    }
    db.run(
      'INSERT INTO hero_slides (title, subtitle, description, accent, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
      [title, subtitle || '', description || '', accent || '', imageUrl, parseInt(sort_order) || 0],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, image_url: imageUrl });
      }
    );
  } catch (error) {
    console.error('Error adding hero slide:', error);
    res.status(500).json({ error: 'Image processing failed.' });
  }
});

// PUT update a hero slide (admin only, image optional)
app.put('/api/hero-slides/:id', authenticateToken, upload.single('image'), async (req, res) => {
  const { title, subtitle, description, accent, sort_order } = req.body;
  const slideId = req.params.id;

  let imageUrl = req.body.image_url; // keep existing if no new upload

  if (req.file) {
    try {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const webpFilename = `hero-${uniqueSuffix}.webp`;
      const processedBuffer = await sharp(req.file.buffer).webp({ quality: 85 }).toBuffer();
      if (process.env.CLOUDINARY_CLOUD_NAME) {
        imageUrl = await uploadToCloudinary(processedBuffer, webpFilename, 'image/webp', 'ias/hero_slides');
      } else {
        const webpPath = path.join(uploadsDir, webpFilename);
        await sharp(req.file.buffer).webp({ quality: 85 }).toFile(webpPath);
        imageUrl = `/uploads/${webpFilename}`;
      }
    } catch (error) {
      console.error('Error processing hero slide image:', error);
      return res.status(500).json({ error: 'Image processing failed.' });
    }
  }

  const fields = ['title = ?', 'subtitle = ?', 'description = ?', 'accent = ?', 'sort_order = ?'];
  const values = [title, subtitle || '', description || '', accent || '', parseInt(sort_order) || 0];
  if (imageUrl) {
    fields.push('image_url = ?');
    values.push(imageUrl);
  }
  values.push(slideId);

  db.run(
    `UPDATE hero_slides SET ${fields.join(', ')} WHERE id = ?`,
    values,
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes, image_url: imageUrl });
    }
  );
});

// DELETE a hero slide (admin only)
app.delete('/api/hero-slides/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM hero_slides WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// Final server setup and error handlers
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // process.exit(1);
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`Accessible at http://localhost:${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Another instance may be running.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});
