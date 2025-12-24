import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const cwd = process.cwd();
const src = path.join(cwd, 'public', 'dbbackground.png');
const outDir = path.join(cwd, 'public', 'icons');

if (!fs.existsSync(src)) {
  console.error('Source image not found:', src);
  process.exit(1);
}

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const sizes = [16, 32, 48, 72, 96, 128, 152, 192, 256, 384, 512];

(async () => {
  try {
    for (const size of sizes) {
      const out = path.join(outDir, `icon-${size}x${size}.png`);
      await sharp(src).resize(size, size, { fit: 'cover' }).png().toFile(out);
      console.log('Written', out);
    }

    // Apple touch icon
    const appleOut = path.join(cwd, 'public', 'apple-touch-icon.png');
    await sharp(src).resize(180, 180, { fit: 'cover' }).png().toFile(appleOut);
    console.log('Written', appleOut);

    // favicon png (48)
    const faviconPng = path.join(cwd, 'public', 'favicon-32x32.png');
    await sharp(src).resize(32, 32, { fit: 'cover' }).png().toFile(faviconPng);
    console.log('Written', faviconPng);

    // webmanifest
    const manifest = {
      name: 'CloudSynthex',
      short_name: 'CloudSynthex',
      icons: sizes.map(s => ({ src: `/icons/icon-${s}x${s}.png`, sizes: `${s}x${s}`, type: 'image/png' })),
      start_url: '/',
      display: 'standalone',
      background_color: '#000000',
      theme_color: '#8B5CF6'
    };

    fs.writeFileSync(path.join(cwd, 'public', 'manifest.json'), JSON.stringify(manifest, null, 2));
    console.log('Written manifest.json');

    console.log('All icons generated successfully.');
  } catch (err) {
    console.error('Error generating icons:', err);
    process.exit(1);
  }
})();
