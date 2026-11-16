// Line-art 3D printer that prints a Rubik's cube layer by layer, on a loop.
// Pure SVG + CSS animation (see .pp-* in style.css). Respects prefers-reduced-motion.

// Cabinet-projection cube sitting on the bed.
const FX0 = 140, FX1 = 270, FY0 = 222, FY1 = 352; // front face
const DX = 34, DY = -26;                          // depth offset
const thirds = [1 / 3, 2 / 3];

const lerp = (a, b, t) => a + (b - a) * t;

export default function PrinterAnimation() {
  const silhouette = `${FX0},${FY1} ${FX0},${FY0} ${FX0 + DX},${FY0 + DY} ${FX1 + DX},${FY0 + DY} ${FX1 + DX},${FY1 + DY} ${FX1},${FY1}`;
  const layerYs = [];
  for (let y = FY0 + DY; y <= FY1; y += 6) layerYs.push(y);

  return (
    <svg className="pp" viewBox="0 0 420 440" role="img" aria-label="Animated 3D printer printing an object layer by layer">
      <defs>
        <clipPath id="pp-silhouette">
          <polygon points={silhouette} />
        </clipPath>
      </defs>

      <g className="pp-line">
        {/* Spool */}
        <circle cx="210" cy="36" r="26" className="pp-fill" />
        <circle cx="210" cy="36" r="17" className="pp-fill-soft" />
        <circle cx="210" cy="36" r="6" className="pp-fill" />
        <rect x="196" y="58" width="28" height="8" rx="2" className="pp-fill" />

        {/* Frame */}
        <rect x="44" y="64" width="18" height="338" rx="4" className="pp-fill" />
        <rect x="358" y="64" width="18" height="338" rx="4" className="pp-fill" />
        <rect x="44" y="64" width="332" height="18" rx="4" className="pp-fill" />

        {/* Bed */}
        <rect x="150" y="366" width="12" height="34" className="pp-fill" />
        <rect x="258" y="366" width="12" height="34" className="pp-fill" />
        <rect x="86" y="352" width="248" height="14" rx="3" className="pp-fill-soft" />

        {/* Base */}
        <rect x="30" y="400" width="360" height="28" rx="8" className="pp-fill" />
        <rect x="50" y="407" width="44" height="14" rx="2" className="pp-screen" />
        <circle cx="110" cy="414" r="5" className="pp-fill" />
      </g>

      {/* The print */}
      <g className="pp-object">
        <g className="pp-line">
          <polygon points={`${FX0},${FY0} ${FX1},${FY0} ${FX1 + DX},${FY0 + DY} ${FX0 + DX},${FY0 + DY}`} className="pp-top" />
          <polygon points={`${FX1},${FY0} ${FX1 + DX},${FY0 + DY} ${FX1 + DX},${FY1 + DY} ${FX1},${FY1}`} className="pp-side" />
          <rect x={FX0} y={FY0} width={FX1 - FX0} height={FY1 - FY0} className="pp-fill" />
        </g>
        <g className="pp-grid">
          {thirds.map((t) => (
            <g key={t}>
              {/* front */}
              <line x1={lerp(FX0, FX1, t)} y1={FY0} x2={lerp(FX0, FX1, t)} y2={FY1} />
              <line x1={FX0} y1={lerp(FY0, FY1, t)} x2={FX1} y2={lerp(FY0, FY1, t)} />
              {/* top */}
              <line x1={FX0 + DX * t} y1={FY0 + DY * t} x2={FX1 + DX * t} y2={FY0 + DY * t} />
              <line x1={lerp(FX0, FX1, t)} y1={FY0} x2={lerp(FX0, FX1, t) + DX} y2={FY0 + DY} />
              {/* side */}
              <line x1={FX1 + DX * t} y1={FY0 + DY * t} x2={FX1 + DX * t} y2={FY1 + DY * t} />
              <line x1={FX1} y1={lerp(FY0, FY1, t)} x2={FX1 + DX} y2={lerp(FY0, FY1, t) + DY} />
            </g>
          ))}
        </g>
        <g className="pp-layers" clipPath="url(#pp-silhouette)">
          {layerYs.map((y) => <line key={y} x1={FX0} y1={y} x2={FX1 + DX} y2={y} />)}
        </g>
        {/* Covers whatever hasn't been "printed" yet; shrinks upward in layer steps. */}
        <rect className="pp-cover" x={FX0 - 6} y={FY0 + DY - 4} width={FX1 - FX0 + DX + 12} height={FY1 - (FY0 + DY) + 4} />
      </g>

      {/* Gantry rises one layer at a time; the head sweeps side to side. */}
      <g className="pp-gantry">
        <g className="pp-line">
          <rect x="62" y="304" width="296" height="12" rx="3" className="pp-fill-soft" />
          <rect x="38" y="298" width="30" height="24" rx="4" className="pp-fill" />
          <rect x="352" y="298" width="30" height="24" rx="4" className="pp-fill" />
        </g>
        <g className="pp-head">
          <g className="pp-line">
            <rect x="188" y="296" width="44" height="40" rx="6" className="pp-fill" />
            <circle cx="210" cy="316" r="11" className="pp-fill-soft" />
            <line x1="210" y1="306" x2="210" y2="326" />
            <line x1="200" y1="316" x2="220" y2="316" />
            <polygon points="201,336 219,336 213,348 207,348" className="pp-fill" />
          </g>
          <rect x="207" y="348" width="6" height="4" rx="1" className="pp-hot" />
        </g>
      </g>
    </svg>
  );
}
