import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const optimizedDir = path.join(__dirname, '..', 'src', 'assets', 'optimized');

if (!fs.existsSync(optimizedDir)) {
  fs.mkdirSync(optimizedDir, { recursive: true });
}

const directoriesToScan = [assetsDir, optimizedDir];

for (const dir of directoriesToScan) {
  if (!fs.existsSync(dir)) continue;

  const files = fs.readdirSync(dir);
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const inputPath = path.join(dir, file);

    // Skip if not an image or if it's already an optimized file in the optimized dir (unless we want to re-optimize)
    if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
    if (dir === optimizedDir && !['.webp'].includes(ext)) continue;

    const outputPath = path.join(optimizedDir, file.replace(ext, '.webp'));

    try {
      const stats = fs.statSync(inputPath);
      // Only optimize if > 300KB or if it's a conversion
      if (stats.size < 300 * 1024 && ext === '.webp') continue;

      const isLogo = file.toLowerCase().includes('logo');
      const options = isLogo ? { lossless: true } : { quality: 75, effort: 6 };

      let pipeline = sharp(inputPath);

      // Resize if too large for web (e.g. 1920px max width)
      const metadata = await pipeline.metadata();
      if (metadata.width > 1920) {
        pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
      }

      await pipeline
        .webp(options)
        .toFile(outputPath + '.tmp');

      // Move tmp to final
      fs.renameSync(outputPath + '.tmp', outputPath);

      const newStats = fs.statSync(outputPath);
      console.log(`Optimized ${file}: ${Math.round(stats.size / 1024)}KB -> ${Math.round(newStats.size / 1024)}KB`);
    } catch (error) {
      console.error(`Error optimizing ${file}:`, error);
    }
  }
}