const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'o0bhyhix',
  api_key: process.env.CLOUDINARY_API_KEY || '497552822935358',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'U-pZ_xqFuDE89UfigMvX1GOwwUo',
  secure: true,
});

async function main() {
  console.log('--- Scanning Website for Active Image References ---');

  const activeFilenames = new Set();

  // 1. Scan uploads_map.json
  const mapPath = path.join(__dirname, '..', 'backend', 'uploads_map.json');
  if (fs.existsSync(mapPath)) {
    const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    Object.keys(map).forEach(k => {
      activeFilenames.add(k.toLowerCase());
      const url = map[k];
      if (url) {
        const parts = url.split('/');
        const fname = parts[parts.length - 1];
        activeFilenames.add(fname.toLowerCase());
      }
    });
  }

  // 2. Scan public/uploads directory
  const uploadsDir = path.join(__dirname, '..', 'public', 'uploads');
  if (fs.existsSync(uploadsDir)) {
    fs.readdirSync(uploadsDir).forEach(f => activeFilenames.add(f.toLowerCase()));
  }

  // 3. Scan src/ assets directory
  const srcAssetsDir = path.join(__dirname, '..', 'src', 'assets');
  if (fs.existsSync(srcAssetsDir)) {
    fs.readdirSync(srcAssetsDir).forEach(f => activeFilenames.add(f.toLowerCase()));
  }

  console.log(`Collected ${activeFilenames.size} active filename patterns.`);

  // 4. Fetch all resources in Cloudinary
  console.log('--- Fetching Cloudinary Assets ---');
  let nextCursor = null;
  let allResources = [];

  do {
    const res = await cloudinary.api.resources({
      type: 'upload',
      prefix: 'ias/',
      max_results: 500,
      next_cursor: nextCursor
    });
    allResources = allResources.concat(res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);

  console.log(`Found total ${allResources.length} assets in Cloudinary.`);

  const activeResources = [];
  const unusedResources = [];

  allResources.forEach(res => {
    const publicId = res.public_id.toLowerCase();
    const filename = path.basename(publicId);

    let isUsed = false;
    for (const pattern of activeFilenames) {
      if (publicId.includes(pattern) || pattern.includes(filename) || filename.includes(pattern)) {
        isUsed = true;
        break;
      }
    }

    if (isUsed) {
      activeResources.push(res);
    } else {
      unusedResources.push(res);
    }
  });

  console.log(`Active Assets: ${activeResources.length}`);
  console.log(`Unused Assets: ${unusedResources.length}`);

  if (unusedResources.length > 0) {
    console.log('\nUnused assets to delete:');
    const deleteIds = unusedResources.map(r => r.public_id);
    deleteIds.forEach(id => console.log(' -', id));

    console.log('\nDeleting unused assets from Cloudinary...');
    // Delete in batches of 100
    for (let i = 0; i < deleteIds.length; i += 100) {
      const batch = deleteIds.slice(i, i + 100);
      const delRes = await cloudinary.api.delete_resources(batch);
      console.log(`Deleted batch ${i / 100 + 1}:`, delRes.deleted);
    }
    console.log('Cleanup complete!');
  } else {
    console.log('All Cloudinary assets are actively used on the website. No unused files found.');
  }
}

main().catch(err => console.error('Error running Cloudinary cleanup:', err));
