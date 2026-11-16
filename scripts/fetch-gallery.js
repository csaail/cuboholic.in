// Build-time: pull the Pexels collection into src/data/gallery.json so the API key
// never ships to the browser. Runs automatically before `npm run build`.
//
// Needs PEXELS_API_KEY in .env.local (gitignored). If the key is missing or the
// request fails, the existing gallery.json is kept and the build carries on.
//
// Run manually: npm run gallery

import { writeFile } from 'node:fs/promises';
import process from 'node:process';

const COLLECTION_ID = '0xquq7j';
const PER_PAGE = 16;
const OUT = new URL('../src/data/gallery.json', import.meta.url);

const key = process.env.PEXELS_API_KEY;
if (!key) {
  console.warn('[gallery] PEXELS_API_KEY not set — keeping existing src/data/gallery.json');
  process.exit(0);
}

try {
  const res = await fetch(
    `https://api.pexels.com/v1/collections/${COLLECTION_ID}?type=photos&per_page=${PER_PAGE}`,
    { headers: { Authorization: key } }
  );
  if (!res.ok) throw new Error(`Pexels responded ${res.status}`);
  const data = await res.json();

  // Keep only the fields the Gallery component uses.
  const photos = (data.media || []).map((p) => ({
    id: p.id,
    alt: (p.alt || '').replace(/^Free stock photo of /i, ''),
    width: p.width,
    height: p.height,
    src: { medium: p.src.medium, large2x: p.src.large2x },
  }));

  if (photos.length === 0) throw new Error('collection returned no photos');

  await writeFile(OUT, JSON.stringify(photos, null, 2) + '\n');
  console.log(`[gallery] wrote ${photos.length} photos to src/data/gallery.json`);
} catch (err) {
  console.warn(`[gallery] fetch failed (${err.message}) — keeping existing src/data/gallery.json`);
}
