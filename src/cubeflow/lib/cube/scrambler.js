// Lightweight WCA-style scrambler (3x3).
// Avoids back-to-back same-face and back-to-back opposite-face turns.

import { moveToString } from './notation.js';

const FACES = ['U', 'D', 'R', 'L', 'F', 'B'];
const OPPOSITE = { U: 'D', D: 'U', R: 'L', L: 'R', F: 'B', B: 'F' };

function pickFace(prev, prevPrev) {
  while (true) {
    const f = FACES[Math.floor(Math.random() * FACES.length)];
    if (f === prev) continue;
    if (OPPOSITE[f] === prev && f === prevPrev) continue;
    return f;
  }
}

function pickTurns() {
  const n = Math.floor(Math.random() * 3);
  return n === 0 ? 1 : n === 1 ? -1 : 2;
}

export function generateScramble(length = 20) {
  const moves = [];
  let prev = null;
  let prevPrev = null;
  for (let i = 0; i < length; i++) {
    const face = pickFace(prev, prevPrev);
    moves.push({ face, turns: pickTurns() });
    prevPrev = prev;
    prev = face;
  }
  return moves;
}

export function generateScrambleString(length = 20) {
  return generateScramble(length).map(moveToString).join(' ');
}
