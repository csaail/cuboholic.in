// Artwork showcase. Drop images in /public/artwork/ (any ratio is fine — portrait works best).
// After adding, run `node scripts/optimize-images.js` to generate .webp versions.
// Order matters — pairs are shown 2 per spread (left page, right page).

const artworks = [
  { src: '/artwork/1.webp', alt: 'Sketch 1' },
  { src: '/artwork/2.webp', alt: 'Sketch 2' },
  { src: '/artwork/3.webp', alt: 'Sketch 3' },
  { src: '/artwork/4.webp', alt: 'Sketch 4' },
  { src: '/artwork/5.webp', alt: 'Sketch 5' },
];

export default artworks;
