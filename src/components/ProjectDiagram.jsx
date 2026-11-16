// Generates an ink-style architecture diagram from a list of pipeline steps.
// Steps snake across rows of three (→ then ←), joined by flowing dashed arrows,
// with a data "packet" that travels the whole pipeline on a loop.

const COLS = 3;
const NODE_W = 88;
const NODE_H = 34;
const COL_X = [56, 160, 264]; // node centres
const ROW_GAP = 66;
const TOP = 34;

function layout(steps) {
  return steps.map((label, i) => {
    const row = Math.floor(i / COLS);
    const inRow = i % COLS;
    const col = row % 2 === 0 ? inRow : COLS - 1 - inRow;
    return { label, x: COL_X[col], y: TOP + row * ROW_GAP, row };
  });
}

// Edge-to-edge connector between two consecutive nodes.
function connector(a, b) {
  if (a.row === b.row) {
    const dir = b.x > a.x ? 1 : -1;
    return `M${a.x + dir * (NODE_W / 2)} ${a.y} L${b.x - dir * (NODE_W / 2 + 4)} ${b.y}`;
  }
  return `M${a.x} ${a.y + NODE_H / 2} L${b.x} ${b.y - NODE_H / 2 - 4}`;
}

export default function ProjectDiagram({ steps, id, large = false }) {
  const nodes = layout(steps);
  const rows = Math.ceil(steps.length / COLS);
  const height = TOP + (rows - 1) * ROW_GAP + NODE_H / 2 + 18;
  const route = nodes.map((n, i) => `${i ? 'L' : 'M'}${n.x} ${n.y}`).join(' ');
  const marker = `pd-arrow-${id}`;
  const last = nodes.length - 1;

  return (
    <svg
      className={`pd${large ? ' pd--large' : ''}`}
      viewBox={`0 0 320 ${height}`}
      role="img"
      aria-label={`Pipeline: ${steps.join(' → ')}`}
    >
      <defs>
        <marker id={marker} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M1 1 L8 5 L1 9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {nodes.slice(1).map((n, i) => (
        <path key={`c${i}`} className="pd-link" d={connector(nodes[i], n)} markerEnd={`url(#${marker})`} />
      ))}

      {/* packet travels the centre line, hidden behind the boxes, visible on the links */}
      <circle className="pd-packet" r="3.5">
        <animateMotion dur={`${steps.length * 0.75}s`} repeatCount="indefinite" path={route} />
      </circle>

      {nodes.map((n, i) => {
        const edge = i === 0 || i === last;
        return (
          <g key={n.label} className={`pd-node${edge ? ' pd-node--edge' : ''}`} style={{ '--i': i }}>
            <rect x={n.x - NODE_W / 2} y={n.y - NODE_H / 2} width={NODE_W} height={NODE_H} rx="8" />
            <text x={n.x} y={n.y + 0.5}>{n.label}</text>
            <text className="pd-step" x={n.x - NODE_W / 2 + 6} y={n.y - NODE_H / 2 - 5}>
              {String(i + 1).padStart(2, '0')}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
