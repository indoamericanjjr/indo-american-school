const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, 'uploads');

fs.readdir(uploadsDir, (err, files) => {
  if (err) {
    console.error('Error reading uploads directory:', err);
    return;
  }

  files.forEach(file => {
    const ext = path.extname(file).toLowerCase();
    if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
      const inputPath = path.join(uploadsDir, file);
      const outputPath = path.join(uploadsDir, path.basename(file, ext) + '.webp');

      sharp(inputPath)
        .resize(1200, null, { withoutEnlargement: true }) // max width 1200, maintain aspect ratio
        .webp({ quality: 100 })
        .toFile(outputPath)
        .then(() => {
          console.log(`Converted ${file} to ${path.basename(outputPath)}`);
        })
        .catch(err => {
          console.error(`Error converting ${file}:`, err);
        });
    }
  });
});