import { Link } from 'react-router-dom';
import { Flame, Trophy, Target, Clock, ChevronRight, Zap, Sparkles } from 'lucide-react';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import StatTile from '../components/ui/StatTile.jsx';
import ProgressRing from '../components/ui/ProgressRing.jsx';
import Chip from '../components/ui/Chip.jsx';
import Button from '../components/ui/Button.jsx';
import { useUserStore, deriveLevel, xpForLevel } from '../store/userStore.js';
import { useTimerStore } from '../store/timerStore.js';
import { LESSONS } from '../data/lessons.js';
import { ALGORITHMS } from '../data/algorithms.js';
import { formatTime, todayKey } from '../lib/format.js';

export default function Dashboard() {
  const xp = useUserStore((s) => s.xp);
  const streak = useUserStore((s) => s.streak.count);
  const lessonsCompleted = useUserStore((s) => s.lessonsCompleted);
  const algosMastered = useUserStore((s) => s.algosMastered);
  const heatmap = useUserStore((s) => s.heatmap);
  const onboarded = useUserStore((s) => s.onboarded);
  const solves = useTimerStore((s) => s.solves);
  const bestSingle = useTimerStore.getState().bestSingle;

  const level = deriveLevel(xp);
  const nextLvl = xpForLevel(level + 1);
  const prevLvl = xpForLevel(level);

  const next = LESSONS.find((l) => !lessonsCompleted.includes(l.id) && l.prereq.every((p) => lessonsCompleted.includes(p)));
  const recentAlgos = algosMastered.slice(-4).map((id) => ALGORITHMS.find((a) => a.id === id)).filter(Boolean);
  const today = heatmap[todayKey()] || { solves: 0, minutes: 0, xp: 0 };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {!onboarded && (
        <GlassPanel className="mb-8 flex flex-wrap items-center justify-between gap-4 !bg-cf-accent/10 !border-cf-accent/30">
          <div>
            <div className="font-display font-semibold text-cf-hi">Personalise your path</div>
            <div className="text-sm text-cf-mid">Quick 4-step onboarding to tailor lessons to your level.</div>
          </div>
          <Link to="/cubeflow/onboarding"><Button icon={Sparkles}>Start onboarding</Button></Link>
        </GlassPanel>
      )}

      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <Chip tone="mint">Welcome back</Chip>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-cf-hi mt-3">Your cube, every day.</h1>
        </div>
        <Link to="/cubeflow/timer">
          <Button variant="mint" icon={Clock}>Start a session</Button>
        </Link>
      </div>

      {/* Top row: hero stats */}
      <div className="grid lg:grid-cols-3 gap-4 mb-8">
        <GlassPanel className="lg:col-span-1 flex items-center gap-6">
          <ProgressRing
            value={xp - prevLvl}
            max={nextLvl - prevLvl}
            size={120}
            label={`L${level}`}
            sublabel="LEVEL"
          />
          <div>
            <div className="text-xs uppercase tracking-wider text-cf-lo">Total XP</div>
            <div className="font-display text-3xl font-bold text-cf-hi tabular-nums">{xp}</div>
            <div className="text-sm text-cf-mid mt-1">{nextLvl - xp} XP to L{level + 1}</div>
          </div>
        </GlassPanel>

        <StatTile
          label="Streak"
          value={`${streak} days`}
          sublabel={streak > 0 ? 'Keep it alive — solve today.' : 'Solve today to start your streak.'}
          icon={Flame}
          accent="warn"
        />
        <StatTile
          label="Best single"
          value={bestSingle ? formatTime(bestSingle) : '—'}
          sublabel={`${solves.length} total solves`}
          icon={Trophy}
          accent="mint"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Continue learning */}
        <GlassPanel className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-xl text-cf-hi flex items-center gap-2">
              <Target className="w-5 h-5 text-cf-accent" /> Continue learning
            </h2>
            <Link to="/cubeflow/learn" className="text-xs text-cf-mid hover:text-cf-hi flex items-center gap-1">
              Roadmap <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          {next ? (
            <Link to={`/cubeflow/learn/${next.id}`}>
              <GlassPanel hover className="!bg-white/5 !p-5 group">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Chip tone={next.level === 'Beginner' ? 'mint' : next.level === 'Intermediate' ? 'accent' : 'warn'}>
                        {next.level}
                      </Chip>
                      <span className="text-[10px] uppercase tracking-wider text-cf-lo">+{next.rewardXp} XP</span>
                    </div>
                    <div className="font-display font-semibold text-lg text-cf-hi">{next.title}</div>
                    <div className="text-sm text-cf-mid mt-1">{next.summary}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-cf-mid group-hover:text-cf-accent transition-colors" />
                </div>
              </GlassPanel>
            </Link>
          ) : (
            <div className="text-cf-mid text-sm">All tracks complete! Drill in the trainer to keep your edge.</div>
          )}

          {/* Daily challenge */}
          <div className="mt-6 pt-6 border-t border-cf-line">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-sm text-cf-hi flex items-center gap-2">
                <Zap className="w-4 h-4 text-cf-warn" /> Daily challenge
              </h3>
              <Chip tone="warn">+250 XP</Chip>
            </div>
            <div className="cf-notation text-sm bg-cf-bg2 rounded-cf-md px-4 py-3 text-cf-hi">
              R U R' U' F' U2 F R U' R' D' L F2 D L' U2
            </div>
            <div className="mt-3 flex justify-between items-center">
              <div className="text-xs text-cf-mid">Today's scramble — same for everyone.</div>
              <Link to="/cubeflow/timer"><Button size="sm">Solve it</Button></Link>
            </div>
          </div>
        </GlassPanel>

        {/* Sidebar */}
        <div className="space-y-4">
          <GlassPanel>
            <div className="text-xs uppercase tracking-wider text-cf-lo mb-3">Today</div>
            <div className="flex justify-between text-sm py-1">
              <span className="text-cf-mid">Solves</span>
              <span className="font-mono text-cf-hi">{today.solves}</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span className="text-cf-mid">Practice time</span>
              <span className="font-mono text-cf-hi">{today.minutes.toFixed(1)}m</span>
            </div>
            <div className="flex justify-between text-sm py-1">
              <span className="text-cf-mid">XP earned</span>
              <span className="font-mono text-cf-accent">+{today.xp}</span>
            </div>
          </GlassPanel>

          <GlassPanel>
            <div className="text-xs uppercase tracking-wider text-cf-lo mb-3">Recent algorithms</div>
            {recentAlgos.length ? (
              <div className="space-y-2">
                {recentAlgos.map((a) => (
                  <Link key={a.id} to={`/cubeflow/algorithms/${a.id}`} className="block hover:bg-white/5 -mx-2 px-2 py-1.5 rounded-cf-sm transition-colors">
                    <div className="text-sm text-cf-hi font-medium">{a.name}</div>
                    <div className="cf-notation text-xs text-cf-mid">{a.notation}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-sm text-cf-mid">No algos mastered yet.</div>
            )}
            <Link to="/cubeflow/algorithms" className="text-xs text-cf-accent hover:underline mt-3 block">
              Browse all →
            </Link>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
