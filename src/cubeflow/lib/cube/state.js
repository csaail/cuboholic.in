// 54-sticker facelet model. Indices follow Kociemba's URFDLB order.
// Faces (each 9 stickers, row-major):
//   U: 0..8   R: 9..17   F: 18..26   D: 27..35   L: 36..44   B: 45..53
// Each face index 0..8:
//   0 1 2
//   3 4 5
//   6 7 8

export const FACES = ['U', 'R', 'F', 'D', 'L', 'B'];
export const SOLVED = 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB';

// Adjacency: for each face, the 12 sticker indices that move when that face turns
// (3 stickers from each of 4 adjacent faces, in CW order around the face).
// Format: array of 4 triplets of indices on neighbouring faces.
const ADJACENT = {
  U: [
    [45, 46, 47], // B top row (rotated read)
    [9, 10, 11],  // R top row
    [18, 19, 20], // F top row
    [36, 37, 38], // L top row
  ],
  D: [
    [24, 25, 26], // F bottom
    [15, 16, 17], // R bottom
    [51, 52, 53], // B bottom (will be rotated read)
    [42, 43, 44], // L bottom
  ],
  F: [
    [6, 7, 8],    // U bottom row
    [9, 12, 15],  // R left col
    [29, 28, 27], // D top row reversed
    [44, 41, 38], // L right col reversed
  ],
  B: [
    [2, 1, 0],    // U top row reversed
    [36, 39, 42], // L left col
    [33, 34, 35], // D bottom row
    [17, 14, 11], // R right col reversed
  ],
  R: [
    [8, 5, 2],    // U right col reversed → top-bottom
    [45, 48, 51], // B left col
    [35, 32, 29], // D right col reversed (top→bottom on D right)
    [26, 23, 20], // F right col reversed
  ],
  L: [
    [0, 3, 6],    // U left col
    [18, 21, 24], // F left col
    [27, 30, 33], // D left col
    [53, 50, 47], // B right col reversed
  ],
};

// Indices of stickers on a face's own ring (CW), used when rotating the face itself.
// Centre index 4 stays put.
const FACE_RING_CW = [0, 1, 2, 5, 8, 7, 6, 3];

function rotateFaceCW(arr, face) {
  const base = FACES.indexOf(face) * 9;
  const out = [...arr];
  // Rotate the ring of 8 corner+edge stickers CW by 2 positions.
  for (let i = 0; i < 8; i++) {
    out[base + FACE_RING_CW[(i + 2) % 8]] = arr[base + FACE_RING_CW[i]];
  }
  return out;
}

function rotateFaceCCW(arr, face) {
  const base = FACES.indexOf(face) * 9;
  const out = [...arr];
  for (let i = 0; i < 8; i++) {
    out[base + FACE_RING_CW[(i + 6) % 8]] = arr[base + FACE_RING_CW[i]];
  }
  return out;
}

function cycleAdjacent(arr, face, dir) {
  // dir = 1 for CW, -1 for CCW
  const ring = ADJACENT[face];
  const out = [...arr];
  const order = dir === 1 ? [0, 1, 2, 3] : [0, 3, 2, 1];
  // Each segment moves to the next segment in `order`.
  for (let s = 0; s < 4; s++) {
    const from = ring[order[s]];
    const to = ring[order[(s + 1) % 4]];
    for (let i = 0; i < 3; i++) {
      out[to[i]] = arr[from[i]];
    }
  }
  return out;
}

export function applyMove(state, move) {
  // move: object { face: 'U'|'R'|..., turns: 1|2|-1 }
  const arr = typeof state === 'string' ? state.split('') : [...state];
  let result = arr;
  const turns = move.turns;
  const dir = turns === -1 ? -1 : 1;
  const repeats = Math.abs(turns);
  for (let i = 0; i < repeats; i++) {
    result = dir === 1
      ? rotateFaceCW(result, move.face)
      : rotateFaceCCW(result, move.face);
    result = cycleAdjacent(result, move.face, dir);
  }
  return typeof state === 'string' ? result.join('') : result;
}

export function applyMoves(state, moves) {
  return moves.reduce((s, m) => applyMove(s, m), state);
}

export function isSolved(state) {
  const s = typeof state === 'string' ? state : state.join('');
  return s === SOLVED;
}
