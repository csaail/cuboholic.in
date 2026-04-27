import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shuffle, RotateCcw, Camera, Wand2, ChevronLeft,
} from 'lucide-react';
import Cube3D from '../components/cube/Cube3D.jsx';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import Button from '../components/ui/Button.jsx';
import Chip from '../components/ui/Chip.jsx';
import { SOLVED, applyMoves } from '../lib/cube/state.js';
import { generateScramble, generateScrambleString } from '../lib/cube/scrambler.js';
import { moveToString, inverseMoves } from '../lib/cube/notation.js';

const FACE_BUTTONS = [
  { face: 'U', color: '#FFFFFF', textColor: '#000' },
  { face: 'D', color: '#FFD400', textColor: '#000' },
  { face: 'F', color: '#009B48' },
  { face: 'B', color: '#0046AD' },
  { face: 'R', color: '#B71234' },
  { face: 'L', color: '#FF5800' },
];

export default function Solver() {
  const [baseState, setBaseState] = useState(SOLVED);
  const [pending, setPending] = useState([]);
  const [history, setHistory] = useState([]);
  const [scramble, setScramble] = useState('');

  const queueMove = (move) => {
    setPending([move]);
    setHistory((h) => [...h, move]);
  };

  // Once a queued move resolves, the Cube3D internally applies it. We mirror it in baseState
  // so the resolved state stays correct if the cube remounts.
  useEffect(() => {
    if (pending.length) {
      const t = setTimeout(() => {
        setBaseState((s) => applyMoves(s, pending));
        setPending([]);
      }, 250 * pending.length);
      return () => clearTimeout(t);
    }
  }, [pending]);

  const doScramble = () => {
    const moves = generateScramble(20);
    const str = generateScrambleString(20);
    setBaseState(applyMoves(SOLVED, moves));
    setHistory(moves);
    setScramble(str);
    setPending([]);
  };

  const reset = () => {
    setBaseState(SOLVED);
    setHistory([]);
    setPending([]);
    setScramble('');
  };

  const undo = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    const inv = inverseMoves([last])[0];
    setBaseState((s) => applyMoves(s, [inv]));
    setHistory((h) => h.slice(0, -1));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <Chip tone="accent">Playground</Chip>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-cf-hi mt-3">Interactive solver.</h1>
        <p className="mt-3 text-cf-mid max-w-2xl">
          Drag to rotate. Tap a face button to turn that face. Hold <kbd className="cf-notation text-xs px-1.5 py-0.5 bg-white/10 rounded">Shift</kbd> to invert.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        {/* Cube */}
        <div>
          <div className="cf-glass rounded-cf-lg overflow-hidden h-[480px] sm:h-[560px]">
            <Cube3D state={baseState} pendingMoves={pending} interactive />
          </div>

          {/* Move palette */}
          <div className="mt-4 grid grid-cols-6 gap-2">
            {FACE_BUTTONS.map((b) => (
              <FacePad key={b.face} {...b} onTurn={(turns) => queueMove({ face: b.face, turns })} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <GlassPanel>
            <div className="text-xs uppercase tracking-wider text-cf-lo mb-3">Quick actions</div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={doScramble} icon={Shuffle}>Scramble</Button>
              <Button onClick={reset} icon={RotateCcw} variant="secondary">Reset</Button>
              <Button onClick={undo} icon={ChevronLeft} variant="ghost" disabled={!history.length}>Undo</Button>
              <Link to="/cubeflow/scan"><Button icon={Camera} variant="ghost" className="w-full">Scan cube</Button></Link>
            </div>
          </GlassPanel>

          {scramble && (
            <GlassPanel>
              <div className="text-xs uppercase tracking-wider text-cf-lo mb-2">Current scramble</div>
              <div className="cf-notation text-sm text-cf-hi leading-relaxed">{scramble}</div>
            </GlassPanel>
          )}

          <GlassPanel>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs uppercase tracking-wider text-cf-lo">Move history</div>
              <span className="text-[10px] font-mono text-cf-lo">{history.length} moves</span>
            </div>
            <div className="cf-notation text-sm text-cf-hi flex flex-wrap gap-1 max-h-40 overflow-y-auto">
              {history.length === 0 && <span className="text-cf-lo">No moves yet.</span>}
              {history.map((m, i) => (
                <span key={i} className="px-1.5 py-0.5 bg-white/5 rounded">{moveToString(m)}</span>
              ))}
            </div>
          </GlassPanel>

          <GlassPanel className="!bg-cf-accent/10 !border-cf-accent/30">
            <div className="flex items-center gap-2 mb-2">
              <Wand2 className="w-4 h-4 text-cf-accent" />
              <span className="text-xs uppercase tracking-wider text-cf-accent">Coming soon</span>
            </div>
            <div className="text-sm text-cf-hi font-medium">Auto-solve</div>
            <div className="text-xs text-cf-mid mt-1">
              We'll integrate Kociemba's algorithm to give you an optimal solution from any state.
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

function FacePad({ face, color, textColor, onTurn }) {
  return (
    <div className="cf-glass rounded-cf-md p-1.5 flex items-center justify-center gap-1">
      <button
        onClick={(e) => onTurn(e.shiftKey ? -1 : 1)}
        onContextMenu={(e) => { e.preventDefault(); onTurn(-1); }}
        className="flex-1 h-12 rounded-cf-sm font-display font-bold text-lg flex items-center justify-center transition-transform active:scale-95"
        style={{ background: color, color: textColor || '#fff', boxShadow: `0 0 16px -8px ${color}` }}
        title={`Turn ${face} (right-click for inverse)`}
      >
        {face}
      </button>
    </div>
  );
}
