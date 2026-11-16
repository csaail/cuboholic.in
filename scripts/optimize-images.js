// Resize full-size originals in assets-src/ into web-friendly WebPs in public/.
// Originals live outside public/ so they don't get copied into the deployed site.
//
//   assets-src/projects/*.png  → public/projects/*.webp
//   assets-src/artwork/*.png   → public/artwork/*.webp
//   assets-src/hero.png, me.png → public/*.webp
//
// Run: npm run images

import sharp from 'sharp';
import { readdir, stat, mkdir } from 'node:fs/promises';
import path from 'node:path';

const targets = [
  { from: 'assets-src/projects', to: 'public/projects', maxWidth: 1200, quality: 82 },
  { from: 'assets-src/artwork',  to: 'public/artwork',  maxWidth: 1400, quality: 86 },
  { from: 'assets-src',          to: 'public', onlyNames: ['hero.png', 'me.png'], maxWidth: 1600, quality: 85 },
];

async function processFile(src, destDir, { maxWidth, quality }) {
  const dest = path.join(destDir, path.basename(src).replace(/\.(png|jpg|jpeg)$/i, '.webp'));
  const before = (await stat(src)).size;

  await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);

  const after = (await stat(dest)).size;
  const pct = ((1 - after / before) * 100).toFixed(0);
  console.log(`${path.basename(src)} → ${dest}  ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB  (-${pct}%)`);
}

for (const t of targets) {
  await mkdir(t.to, { recursive: true });
  const files = await readdir(t.from);
  for (const f of files) {
    if (t.onlyNames && !t.onlyNames.includes(f)) continue;
    if (!/\.(png|jpg|jpeg)$/i.test(f)) continue;
    await processFile(path.join(t.from, f), t.to, t);
  }
}
