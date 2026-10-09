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

// Clean up any stray .tmp files first
const strayTmp = fs.readdirSync(optimizedDir).filter(f => f.endsWith('.tmp'));
for (const tmp of strayTmp) {
  try { fs.unlinkSync(path.join(optimizedDir, tmp)); } catch (_) {}
}

const files = fs.readdirSync(assetsDir);
for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const inputPath = path.join(assetsDir, file);

  // Skip subdirectories and non-images
  if (!fs.statSync(inputPath).isFile()) continue;
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;

  const outputName = file.replace(/\.[^.]+$/, '.webp');
  const outputPath = path.join(optimizedDir, outputName);
  const tmpPath = outputPath + '.tmp';

  try {
    const stats = fs.statSync(inputPath);
    const isLogo = file.toLowerCase().includes('logo');
    const options = isLogo ? { quality: 85, effort: 6 } : { quality: 78, effort: 5 };

    let pipeline = sharp(inputPath);
    const metadata = await pipeline.metadata();

    if (metadata.width && metadata.width > 1920) {
      pipeline = pipeline.resize(1920, null, { withoutEnlargement: true });
    }

    await pipeline.webp(options).toFile(tmpPath);

    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
    fs.renameSync(tmpPath, outputPath);

    const newStats = fs.statSync(outputPath);
    console.log(`Optimized ${file}: ${Math.round(stats.size / 1024)}KB -> ${Math.round(newStats.size / 1024)}KB`);
  } catch (error) {
    console.error(`Error optimizing ${file}:`, error.message);
    if (fs.existsSync(tmpPath)) {
      try { fs.unlinkSync(tmpPath); } catch (_) {}
    }
  }
}