const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'o0bhyhix',
  api_key: process.env.CLOUDINARY_API_KEY || '497552822935358',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'U-pZ_xqFuDE89UfigMvX1GOwwUo',
  secure: true,
});

// The 16 core active static site images
const core16Images = [
  'hero-new.jpg',
  'hero-1.jpg',
  'world-education.jpg',
  'sports.jpg',
  'library.jpg',
  'about-1.jpg',
  'about-2.jpg',
  'about-3.jpg',
  'cultural.jpg',
  'school-campus.jpg',
  'indo-logo.png',
  '240_F_409195861_3JFdY7kvxO5GFV2zsrvlXEv5p6dYHBpB.jpg',
  '240_F_274385444_M9wwLkwPTAYj8qtmEB5MLLcuA88OQLec.jpg',
  'DSC_1060.JPG',
  'DSC_1183.JPG',
  'DSC_5149.JPG'
];

async function main() {
  console.log('--- Cleaning Cloudinary to keep ONLY the 16 site images ---');

  // 1. Fetch all resources in Cloudinary
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

  const toKeep = [];
  const toDelete = [];

  allResources.forEach(res => {
    const pid = res.public_id.toLowerCase();
    const isCore = core16Images.some(img => pid.includes(img.toLowerCase()));
    if (isCore) {
      toKeep.push(res);
    } else {
      toDelete.push(res);
    }
  });

  console.log(`Assets to Keep: ${toKeep.length}`);
  console.log(`Assets to Delete: ${toDelete.length}`);

  if (toDelete.length > 0) {
    console.log('\nDeleting non-core assets from Cloudinary...');
    const deleteIds = toDelete.map(r => r.public_id);
    for (let i = 0; i < deleteIds.length; i += 100) {
      const batch = deleteIds.slice(i, i + 100);
      const delRes = await cloudinary.api.delete_resources(batch);
      console.log(`Deleted batch ${Math.floor(i / 100) + 1} (${batch.length} files):`, delRes.deleted);
    }
  }

  // 2. Clean uploads_map.json to contain ONLY the core images
  const mapPath = path.join(__dirname, '..', 'backend', 'uploads_map.json');
  let currentMap = {};
  if (fs.existsSync(mapPath)) {
    try { currentMap = JSON.parse(fs.readFileSync(mapPath, 'utf8')); } catch(e){}
  }

  const cleanMap = {};
  Object.keys(currentMap).forEach(k => {
    const kl = k.toLowerCase();
    const isCore = core16Images.some(img => kl.includes(img.toLowerCase()));
    if (isCore) {
      cleanMap[k] = currentMap[k];
    }
  });

  fs.writeFileSync(mapPath, JSON.stringify(cleanMap, null, 2));
  console.log(`Updated ${mapPath} with ${Object.keys(cleanMap).length} core image entries.`);
  console.log('--- Cleanup Finished Cleanly ---');
}

main().catch(err => console.error('Error running script:', err));
