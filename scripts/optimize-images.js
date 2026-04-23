// One-off: resize /public/projects/*.png + /public/hero.png + /public/me.png
// into web-friendly WebPs. Writes alongside the originals.
//
// Run: node scripts/optimize-images.js

import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const targets = [
  { dir: 'public/projects', maxWidth: 1200, quality: 82 },
  { dir: 'public/artwork',  maxWidth: 1400, quality: 86 },
  { dir: 'public',          onlyNames: ['hero.png', 'me.png'], maxWidth: 1600, quality: 85 },
];

async function processFile(src, { maxWidth, quality }) {
  const dest = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
  const before = (await stat(src)).size;

  await sharp(src)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(dest);

  const after = (await stat(dest)).size;
  const pct = ((1 - after / before) * 100).toFixed(0);
  console.log(`${path.basename(src)} → ${path.basename(dest)}  ${(before / 1024).toFixed(0)} KB → ${(after / 1024).toFixed(0)} KB  (-${pct}%)`);
}

for (const t of targets) {
  const files = await readdir(t.dir);
  for (const f of files) {
    if (t.onlyNames && !t.onlyNames.includes(f)) continue;
    if (!/\.(png|jpg|jpeg)$/i.test(f)) continue;
    await processFile(path.join(t.dir, f), t);
  }
}
