import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Trash2, Trophy, Plus, Minus } from 'lucide-react';
import { generateScrambleString } from '../lib/cube/scrambler.js';
import { formatTime, ao } from '../lib/format.js';
import { useTimerStore } from '../store/timerStore.js';
import { useUserStore } from '../store/userStore.js';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import StatTile from '../components/ui/StatTile.jsx';
import Chip from '../components/ui/Chip.jsx';

const HOLD_MS = 550;

export default function Timer() {
  const [scramble, setScramble] = useState(() => generateScrambleString(20));
  const [phase, setPhase] = useState('idle'); // idle | holding | ready | running
  const [elapsed, setElapsed] = useState(0);

  const startTimeRef = useRef(null);
  const holdTimerRef = useRef(null);
  const rafRef = useRef(null);
  const keyDownRef = useRef(false);

  const solves = useTimerStore((s) => s.solves);
  const addSolve = useTimerStore((s) => s.addSolve);
  const removeSolve = useTimerStore((s) => s.removeSolve);
  const togglePlus2 = useTimerStore((s) => s.togglePlus2);
  const toggleDnf = useTimerStore((s) => s.toggleDnf);
  const logSolveXp = useUserStore((s) => s.logSolve);

  const validTimes = solves.filter((s) => !s.dnf).map((s) => s.ms);
  const bestSingle = validTimes.length ? Math.min(...validTimes) : null;
  const currentAo5 = ao(validTimes, 5);
  const currentAo12 = ao(validTimes, 12);

  const newScramble = useCallback(() => {
    setScramble(generateScrambleString(20));
  }, []);

  const tick = useCallback(function tickFn() {
    setElapsed(performance.now() - startTimeRef.current);
    rafRef.current = requestAnimationFrame(tickFn);
  }, []);

  const stopTimer = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    const ms = performance.now() - startTimeRef.current;
    addSolve({ ms, scramble, dnf: false, plus2: false });
    logSolveXp({ ms, scramble });
    setPhase('idle');
    setElapsed(ms);
    newScramble();
  }, [addSolve, logSolveXp, scramble, newScramble]);

  // Spacebar / touch handlers
  useEffect(() => {
    const handleDown = (e) => {
      // Ignore typing in input fields
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code !== 'Space' && e.type === 'keydown') return;
      if (keyDownRef.current) return;
      keyDownRef.current = true;
      if (e.preventDefault) e.preventDefault();

      if (phase === 'running') {
        stopTimer();
        return;
      }
      if (phase === 'idle') {
        setPhase('holding');
        setElapsed(0);
        holdTimerRef.current = setTimeout(() => setPhase('ready'), HOLD_MS);
      }
    };

    const handleUp = (e) => {
      if (e.code !== 'Space' && e.type === 'keyup') return;
      keyDownRef.current = false;
      if (phase === 'holding') {
        clearTimeout(holdTimerRef.current);
        setPhase('idle');
      } else if (phase === 'ready') {
        clearTimeout(holdTimerRef.current);
        startTimeRef.current = performance.now();
        setPhase('running');
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [phase, stopTimer, tick]);

  // Touch handlers for the big timer area
  const onTouchStart = (e) => {
    e.preventDefault();
    if (phase === 'running') return stopTimer();
    if (phase === 'idle') {
      setPhase('holding');
      setElapsed(0);
      holdTimerRef.current = setTimeout(() => setPhase('ready'), HOLD_MS);
    }
  };
  const onTouchEnd = (e) => {
    e.preventDefault();
    if (phase === 'holding') {
      clearTimeout(holdTimerRef.current);
      setPhase('idle');
    } else if (phase === 'ready') {
      clearTimeout(holdTimerRef.current);
      startTimeRef.current = performance.now();
      setPhase('running');
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  const colorByPhase = {
    idle: 'text-cf-hi',
    holding: 'text-cf-danger',
    ready: 'text-cf-accent2',
    running: 'text-cf-accent2',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Scramble */}
      <GlassPanel className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-cf-lo mb-2">Scramble</div>
            <div className="cf-notation text-base sm:text-xl text-cf-hi leading-relaxed break-words">{scramble}</div>
          </div>
          <button
            onClick={newScramble}
            className="cf-glass rounded-cf-sm p-2 hover:border-cf-line2 transition-colors"
            title="New scramble"
          >
            <Shuffle className="w-4 h-4 text-cf-mid" />
          </button>
        </div>
      </GlassPanel>

      {/* Timer area */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseUp={onTouchEnd}
        className="cf-glass rounded-cf-xl select-none cursor-pointer min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center text-center mb-6 transition-colors"
        style={{
          background:
            phase === 'ready'
              ? 'radial-gradient(ellipse at center, rgba(0,229,199,0.18), transparent 60%)'
              : phase === 'holding'
              ? 'radial-gradient(ellipse at center, rgba(255,84,112,0.15), transparent 60%)'
              : undefined,
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={phase + (phase === 'running' ? 'running' : '')}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`font-display font-bold text-7xl sm:text-9xl tabular-nums ${colorByPhase[phase]}`}
          >
            {formatTime(elapsed)}
          </motion.div>
        </AnimatePresence>
        <div className="mt-4 text-sm text-cf-mid">
          {phase === 'idle' && 'Press & hold spacebar (or tap & hold). Release to start.'}
          {phase === 'holding' && 'Keep holding…'}
          {phase === 'ready' && 'Release to start!'}
          {phase === 'running' && 'Press any key (or tap) to stop.'}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatTile label="Best single" value={bestSingle ? formatTime(bestSingle) : '—'} icon={Trophy} accent="warn" />
        <StatTile label="Current ao5" value={currentAo5 ? formatTime(currentAo5) : '—'} accent="accent" />
        <StatTile label="Current ao12" value={currentAo12 ? formatTime(currentAo12) : '—'} accent="mint" />
        <StatTile label="Total solves" value={solves.length} accent="accent" />
      </div>

      {/* Solve history */}
      <GlassPanel>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-cf-hi">Recent solves</h3>
          <Chip>{solves.length}</Chip>
        </div>
        {solves.length === 0 ? (
          <div className="text-sm text-cf-mid py-8 text-center">
            No solves yet. Hold spacebar to begin.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-cf-lo">
                <tr>
                  <th className="text-left py-2 pr-2">#</th>
                  <th className="text-left py-2 pr-2">Time</th>
                  <th className="text-left py-2 pr-2 hidden sm:table-cell">Scramble</th>
                  <th className="text-right py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...solves].reverse().map((s, i) => (
                  <tr key={s.id} className="border-t border-cf-line">
                    <td className="py-2 pr-2 text-cf-lo font-mono">{solves.length - i}</td>
                    <td className="py-2 pr-2 cf-notation text-cf-hi">
                      {s.dnf ? <span className="text-cf-danger">DNF</span> : formatTime(s.ms)}
                      {s.plus2 && !s.dnf && <span className="text-cf-warn ml-1 text-xs">+2</span>}
                    </td>
                    <td className="py-2 pr-2 cf-notation text-xs text-cf-mid hidden sm:table-cell truncate max-w-xs">
                      {s.scramble}
                    </td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => togglePlus2(s.id)}
                        className="text-xs cf-glass rounded px-1.5 py-0.5 mr-1 hover:border-cf-line2"
                        title="+2 penalty"
                      >+2</button>
                      <button
                        onClick={() => toggleDnf(s.id)}
                        className="text-xs cf-glass rounded px-1.5 py-0.5 mr-1 hover:border-cf-line2"
                        title="DNF"
                      >DNF</button>
                      <button
                        onClick={() => removeSolve(s.id)}
                        className="text-xs cf-glass rounded px-1.5 py-0.5 hover:border-cf-line2 text-cf-danger"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </div>
  );
}
