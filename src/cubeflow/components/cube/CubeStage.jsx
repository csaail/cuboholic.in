import { useState, useCallback } from 'react';
import Cube3D from './Cube3D.jsx';
import { SOLVED, applyMoves } from '../../lib/cube/state.js';
import { parseNotation } from '../../lib/cube/notation.js';
import { generateScramble } from '../../lib/cube/scrambler.js';
import { Play, RotateCcw, Shuffle, Pause } from 'lucide-react';

/**
 * Reusable cube playground: takes a baseState (pre-applied scramble),
 * a notation string for the algorithm, and lets the user play / reset / scramble.
 */
export default function CubeStage({
  algorithm = '',
  setupMoves = '',
  height = 360,
  showControls = true,
  autoSpin = false,
  interactive = true,
  onSolved,
}) {
  // Apply setup (e.g., reverse of algorithm) to give the cube the case the user must solve.
  const buildBase = useCallback(() => {
    const setup = parseNotation(setupMoves);
    return applyMoves(SOLVED, setup);
  }, [setupMoves]);

  const [baseState, setBaseState] = useState(buildBase);
  const [pending, setPending] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [prevSetup, setPrevSetup] = useState(setupMoves);

  // Reset when the setup string changes (e.g. parent loads a new algorithm)
  if (prevSetup !== setupMoves) {
    setPrevSetup(setupMoves);
    setBaseState(buildBase());
    setPending([]);
  }

  const playAlgorithm = () => {
    const moves = parseNotation(algorithm);
    if (!moves.length) return;
    setPending(moves);
    setPlaying(true);
  };

  const reset = () => {
    setBaseState(buildBase());
    setPending([]);
    setPlaying(false);
  };

  const scramble = () => {
    setBaseState(applyMoves(SOLVED, generateScramble(20)));
    setPending([]);
    setPlaying(false);
  };

  const handleComplete = () => {
    setPlaying(false);
    if (onSolved) onSolved();
  };

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative rounded-cf-lg cf-glass overflow-hidden"
        style={{ height }}
      >
        <Cube3D
          state={baseState}
          pendingMoves={pending}
          onMovesComplete={handleComplete}
          autoSpin={autoSpin}
          interactive={interactive}
        />
        {algorithm && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 cf-notation text-xs text-cf-mid bg-cf-bg1/80 backdrop-blur px-3 py-1 rounded-full border border-cf-line">
            {algorithm}
          </div>
        )}
      </div>
      {showControls && (
        <div className="flex flex-wrap items-center gap-2">
          {algorithm && (
            <button
              onClick={playAlgorithm}
              disabled={playing}
              className="flex items-center gap-2 px-4 py-2 rounded-cf-md bg-cf-accent text-white font-medium text-sm hover:shadow-cf-glow transition-all disabled:opacity-50"
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {playing ? 'Playing…' : 'Play algorithm'}
            </button>
          )}
          <button
            onClick={reset}
            className="flex items-center gap-2 px-4 py-2 rounded-cf-md cf-glass text-sm text-cf-hi hover:border-cf-line2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={scramble}
            className="flex items-center gap-2 px-4 py-2 rounded-cf-md cf-glass text-sm text-cf-hi hover:border-cf-line2 transition-all"
          >
            <Shuffle className="w-4 h-4" />
            Scramble
          </button>
        </div>
      )}
    </div>
  );
}
