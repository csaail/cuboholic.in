// Handwritten word with a marker stroke that draws itself under it when the
// heading is revealed (see .scribble in style.css).
const PATHS = {
  wave: 'M3 15 C 40 6, 80 21, 120 12 S 200 5, 240 13 S 285 16, 297 10',
  swoosh: 'M4 18 C 70 9, 150 6, 296 9 M30 22 C 110 15, 190 14, 270 16',
  loop: 'M6 14 C 60 20, 130 18, 190 12 C 230 8, 262 4, 252 12 C 244 19, 270 20, 296 10',
};

export default function Scribble({ children, variant = 'wave' }) {
  return (
    <em className="scribble">
      {children}
      <svg className="scribble-svg" viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
        <path d={PATHS[variant] || PATHS.wave} pathLength="1" />
      </svg>
    </em>
  );
}
