import { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Repeat, BookOpen } from 'lucide-react';
import { getAlgorithm, ALGORITHMS } from '../data/algorithms.js';
import { useUserStore } from '../store/userStore.js';
import CubeStage from '../components/cube/CubeStage.jsx';
import NotationStrip from '../components/ui/NotationStrip.jsx';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import Button from '../components/ui/Button.jsx';
import Chip from '../components/ui/Chip.jsx';

export default function AlgorithmDetail() {
  const { algId } = useParams();
  const algo = getAlgorithm(algId);
  const mastered = useUserStore((s) => s.algosMastered);
  const masterAlgo = useUserStore((s) => s.masterAlgo);
  const [reps, setReps] = useState(0);

  if (!algo) return <Navigate to="/cubeflow/algorithms" replace />;
  const isMastered = mastered.includes(algo.id);

  const related = ALGORITHMS.filter((a) => a.set === algo.set && a.id !== algo.id).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <Link to="/cubeflow/algorithms" className="text-sm text-cf-mid hover:text-cf-hi flex items-center gap-1 mb-6">
        <ArrowLeft className="w-4 h-4" /> All algorithms
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Chip tone={algo.method === 'CFOP' ? 'accent' : algo.method === 'Beginner' ? 'mint' : 'warn'}>
              {algo.method} · {algo.set}
            </Chip>
            <Chip>{'★'.repeat(algo.difficulty)}{'☆'.repeat(5 - algo.difficulty)}</Chip>
            {isMastered && <Chip tone="mint"><Star className="w-3 h-3 fill-current" /> Mastered</Chip>}
          </div>
          <h1 className="font-display font-bold text-4xl text-cf-hi">{algo.name}</h1>
          <p className="mt-2 text-cf-mid max-w-2xl">{algo.description}</p>
        </div>
        {!isMastered && (
          <Button icon={Star} onClick={() => masterAlgo(algo.id)} variant="mint">
            Mark mastered (+75 XP)
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <CubeStage
            algorithm={algo.notation}
            setupMoves={algo.setup}
            height={460}
          />
        </div>

        <div className="space-y-4">
          <GlassPanel>
            <div className="text-xs uppercase tracking-wider text-cf-lo mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" /> Notation
            </div>
            <NotationStrip notation={algo.notation} />
            <div className="mt-4 cf-notation text-sm text-cf-mid bg-cf-bg2 px-3 py-2 rounded-cf-sm border border-cf-line">
              {algo.notation}
            </div>
          </GlassPanel>

          <GlassPanel>
            <div className="text-xs uppercase tracking-wider text-cf-lo mb-3 flex items-center gap-1.5">
              <Repeat className="w-3.5 h-3.5" /> Drill counter
            </div>
            <div className="flex items-center gap-4">
              <motion.div
                key={reps}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-display text-5xl font-bold text-cf-accent2 tabular-nums"
              >
                {reps}
              </motion.div>
              <div className="flex-1 text-sm text-cf-mid">
                Cement muscle memory by repping this algorithm. Aim for 25+ reps per session.
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button onClick={() => setReps((r) => r + 1)} variant="secondary">+1 rep</Button>
              <Button onClick={() => setReps(0)} variant="ghost">Reset</Button>
              <Link to="/cubeflow/trainer" className="ml-auto">
                <Button variant="ghost" size="sm">Open trainer →</Button>
              </Link>
            </div>
          </GlassPanel>

          {related.length > 0 && (
            <GlassPanel>
              <div className="text-xs uppercase tracking-wider text-cf-lo mb-3">Related — {algo.set}</div>
              <div className="space-y-1">
                {related.map((r) => (
                  <Link key={r.id} to={`/cubeflow/algorithms/${r.id}`} className="block hover:bg-white/5 -mx-2 px-2 py-2 rounded-cf-sm transition-colors">
                    <div className="flex justify-between items-center gap-3">
                      <div className="text-sm text-cf-hi font-medium truncate">{r.name}</div>
                      <div className="cf-notation text-xs text-cf-mid truncate">{r.notation}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </GlassPanel>
          )}
        </div>
      </div>
    </div>
  );
}
