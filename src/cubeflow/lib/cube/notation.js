// Parse WCA notation: R, R', R2, U, U', U2, etc.
// Returns array of { face, turns } where turns ∈ {1, 2, -1}.

const FACE_RE = /^[URFDLB]/;

export function parseNotation(input) {
  if (!input) return [];
  const tokens = input.trim().split(/\s+/).filter(Boolean);
  const moves = [];
  for (const t of tokens) {
    if (!FACE_RE.test(t)) continue;
    const face = t[0];
    const mod = t.slice(1);
    let turns = 1;
    if (mod === "'" || mod === '’') turns = -1;
    else if (mod === '2') turns = 2;
    else if (mod === '') turns = 1;
    else continue;
    moves.push({ face, turns });
  }
  return moves;
}

export function moveToString(move) {
  if (move.turns === 2) return move.face + '2';
  if (move.turns === -1) return move.face + "'";
  return move.face;
}

export function movesToString(moves) {
  return moves.map(moveToString).join(' ');
}

export function inverseMoves(moves) {
  return [...moves].reverse().map((m) => ({
    face: m.face,
    turns: m.turns === 2 ? 2 : -m.turns,
  }));
}
