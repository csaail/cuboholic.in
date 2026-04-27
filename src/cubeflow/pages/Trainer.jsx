import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Zap, Check, X, ChevronRight, Repeat } from 'lucide-react';
import { ALGORITHMS } from '../data/algorithms.js';
import { useUserStore } from '../store/userStore.js';
import CubeStage from '../components/cube/CubeStage.jsx';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import Button from '../components/ui/Button.jsx';
import Chip from '../components/ui/Chip.jsx';
import { formatTime } from '../lib/format.js';

const SETS_AVAILABLE = ['PLL', 'OLL', 'F2L', 'OLL Corners'];

export default function Trainer() {
  const masterAlgo = useUserStore((s) => s.masterAlgo);
  const [setName, setSetName] = useState('PLL');
  const [current, setCurrent] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [reactionStart, setReactionStart] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [session, setSession] = useState({ correct: 0, missed: 0, totalReaction: 0, count: 0 });
  const stageKey = useRef(0);

  const pool = useMemo(
    () => ALGORITHMS.filter((a) => a.set === setName || (setName === 'OLL Corners' && a.set === 'OLL Corners')),
    [setName],
  );

  const drawNext = () => {
    if (!pool.length) return;
    const next = pool[Math.floor(Math.random() * pool.length)];
    stageKey.current += 1;
    setCurrent(next);
    setRevealed(false);
    setReaction(null);
    setReactionStart(performance.now());
  };

  useEffect(() => {
    drawNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setName]);

  const reveal = () => {
    if (revealed || !reactionStart) return;
    const r = performance.now() - reactionStart;
    setReaction(r);
    setRevealed(true);
  };

  const recordResult = (correct) => {
    setSession((s) => ({
      correct: s.correct + (correct ? 1 : 0),
      missed: s.missed + (correct ? 0 : 1),
      totalReaction: s.totalReaction + (reaction || 0),
      count: s.count + 1,
    }));
    if (correct && current) masterAlgo(current.id);
    drawNext();
  };

  const avgReaction = session.count ? session.totalReaction / session.count : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <Chip tone="accent">Trainer</Chip>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-cf-hi mt-3">Algorithm trainer.</h1>
        <p className="mt-3 text-cf-mid max-w-2xl">
          Recognise the case. Execute the algo. Repeat until it's automatic.
        </p>
      </div>

      <GlassPanel className="mb-6">
        <div className="text-xs uppercase tracking-wider text-cf-lo mb-3">Pick a set</div>
        <div className="flex flex-wrap gap-2">
          {SETS_AVAILABLE.map((s) => (
            <button
              key={s}
              onClick={() => setSetName(s)}
              className={`text-sm px-4 py-2 rounded-cf-md border transition-all ${
                setName === s
                  ? 'bg-cf-accent text-white border-cf-accent shadow-cf-glow'
                  : 'bg-white/5 text-cf-mid border-cf-line hover:border-cf-line2 hover:text-cf-hi'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </GlassPanel>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div>
          {current && (
            <CubeStage
              key={stageKey.current}
              algorithm={revealed ? current.notation : ''}
              setupMoves={current.setup}
              height={460}
              showControls={false}
              autoSpin={false}
            />
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            {!revealed ? (
              <Button onClick={reveal} icon={Zap} size="lg">
                Reveal answer
              </Button>
            ) : (
              <>
                <Button onClick={() => recordResult(true)} icon={Check} variant="mint" size="lg">
                  Got it
                </Button>
                <Button onClick={() => recordResult(false)} icon={X} variant="secondary" size="lg">
                  Missed
                </Button>
                <Button onClick={drawNext} icon={Repeat} variant="ghost" size="lg">
                  Skip
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {current && (
            <GlassPanel>
              <div className="text-xs uppercase tracking-wider text-cf-lo mb-2">Case</div>
              <div className="font-display font-bold text-2xl text-cf-hi">{current.name}</div>
              <AnimatePresence>
                {revealed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 cf-notation text-sm text-cf-accent2 bg-cf-accent2/10 px-3 py-2 rounded-cf-sm border border-cf-accent2/30 overflow-hidden"
                  >
                    {current.notation}
                  </motion.div>
                )}
              </AnimatePresence>
              {reaction && (
                <div className="mt-3 text-xs text-cf-mid">
                  Recognition: <span className="cf-notation text-cf-hi">{(reaction / 1000).toFixed(2)}s</span>
                </div>
              )}
            </GlassPanel>
          )}

          <GlassPanel>
            <div className="text-xs uppercase tracking-wider text-cf-lo mb-3 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" /> Session
            </div>
            <div className="space-y-1.5 text-sm">
              <Row label="Attempts" value={session.count} />
              <Row label="Correct" value={session.correct} valueClass="text-cf-accent2" />
              <Row label="Missed" value={session.missed} valueClass="text-cf-danger" />
              <Row
                label="Accuracy"
                value={session.count ? `${Math.round((session.correct / session.count) * 100)}%` : '—'}
              />
              <Row
                label="Avg recognition"
                value={avgReaction ? formatTime(avgReaction) : '—'}
                valueClass="text-cf-accent"
              />
            </div>
            {session.count > 0 && (
              <button
                onClick={() => setSession({ correct: 0, missed: 0, totalReaction: 0, count: 0 })}
                className="mt-4 text-xs text-cf-mid hover:text-cf-hi"
              >
                Reset session
              </button>
            )}
          </GlassPanel>

          <GlassPanel className="!bg-cf-accent2/5 !border-cf-accent2/20">
            <div className="text-xs text-cf-mid">
              <strong className="text-cf-hi">Pro tip:</strong> aim for sub-2s recognition.
              Drill 3 cases per day until you can name them at a glance.
            </div>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, valueClass = 'text-cf-hi' }) {
  return (
    <div className="flex justify-between">
      <span className="text-cf-mid">{label}</span>
      <span className={`font-mono tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}
