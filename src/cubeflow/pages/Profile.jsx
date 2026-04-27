import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Settings, Trophy, Flame, Award, Calendar } from 'lucide-react';
import { useUserStore, deriveLevel, xpForLevel } from '../store/userStore.js';
import { useTimerStore } from '../store/timerStore.js';
import { BADGES, evaluateBadges } from '../data/badges.js';
import { ALGORITHMS } from '../data/algorithms.js';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import StatTile from '../components/ui/StatTile.jsx';
import ProgressRing from '../components/ui/ProgressRing.jsx';
import Chip from '../components/ui/Chip.jsx';
import Button from '../components/ui/Button.jsx';
import { formatTime } from '../lib/format.js';

function buildHeatmapDays(heatmap, days = 105) {
  const out = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    out.push({ key, date: d, ...(heatmap[key] || { solves: 0, minutes: 0, xp: 0 }) });
  }
  return out;
}

function intensity(minutes) {
  if (minutes <= 0) return 0;
  if (minutes < 2) return 1;
  if (minutes < 8) return 2;
  if (minutes < 20) return 3;
  return 4;
}

const HEATMAP_COLORS = [
  'bg-white/[0.04]',
  'bg-cf-accent/25',
  'bg-cf-accent/55',
  'bg-cf-accent/80',
  'bg-cf-accent2',
];

export default function Profile() {
  const xp = useUserStore((s) => s.xp);
  const handle = useUserStore((s) => s.handle);
  const displayName = useUserStore((s) => s.displayName);
  const streak = useUserStore((s) => s.streak.count);
  const lessons = useUserStore((s) => s.lessonsCompleted);
  const algos = useUserStore((s) => s.algosMastered);
  const heatmap = useUserStore((s) => s.heatmap);
  const userBadges = useUserStore((s) => s.badges);
  const unlockBadge = useUserStore((s) => s.unlockBadge);
  const reset = useUserStore((s) => s.reset);

  const solves = useTimerStore((s) => s.solves);
  const validTimes = solves.filter((s) => !s.dnf).map((s) => s.ms);
  const bestSingle = validTimes.length ? Math.min(...validTimes) : null;

  const level = deriveLevel(xp);
  const nextLvl = xpForLevel(level + 1);
  const prevLvl = xpForLevel(level);

  const days = useMemo(() => buildHeatmapDays(heatmap), [heatmap]);
  const totalMinutes = days.reduce((a, b) => a + b.minutes, 0);
  const ollLearned = algos.filter((id) => ALGORITHMS.find((a) => a.id === id)?.set === 'OLL').length;
  const pllLearned = algos.filter((id) => ALGORITHMS.find((a) => a.id === id)?.set === 'PLL').length;

  const stats = {
    totalSolves: solves.length,
    lessonsDone: lessons.length,
    algosLearned: algos.length,
    ollLearned,
    pllLearned,
    bestSingle,
    bestAo5: null,
    bestAo12: null,
    streak,
  };
  const eligibleBadges = evaluateBadges(stats);
  // Auto-unlock newly eligible
  eligibleBadges.forEach((id) => {
    if (!userBadges.includes(id)) unlockBadge(id);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <GlassPanel className="mb-6">
        <div className="flex flex-wrap items-center gap-6">
          <ProgressRing
            value={xp - prevLvl}
            max={nextLvl - prevLvl}
            size={96}
            label={`L${level}`}
            sublabel="LEVEL"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Chip>@{handle}</Chip>
              <Chip tone="warn"><Flame className="w-3 h-3" /> {streak}-day streak</Chip>
            </div>
            <h1 className="font-display font-bold text-3xl text-cf-hi">{displayName}</h1>
            <div className="text-sm text-cf-mid mt-1">
              {xp} XP · {nextLvl - xp} to level {level + 1}
            </div>
          </div>
          <Button variant="ghost" icon={Settings}>Settings</Button>
        </div>
      </GlassPanel>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatTile label="Lessons" value={lessons.length} sublabel="completed" accent="accent" />
        <StatTile label="Algorithms" value={algos.length} sublabel="mastered" accent="mint" />
        <StatTile label="Solves" value={solves.length} icon={Trophy} accent="warn" />
        <StatTile label="Best single" value={bestSingle ? formatTime(bestSingle) : '—'} accent="mint" />
      </div>

      {/* Heatmap */}
      <GlassPanel className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cf-accent" />
            <h2 className="font-display font-semibold text-cf-hi">Practice heatmap</h2>
          </div>
          <div className="text-xs text-cf-mid">{Math.round(totalMinutes)} minutes · last 15 weeks</div>
        </div>
        <div className="overflow-x-auto">
          <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
            {days.map((d) => (
              <div
                key={d.key}
                title={`${d.key} — ${d.solves} solves, ${d.minutes.toFixed(1)} min`}
                className={`w-3 h-3 rounded-sm ${HEATMAP_COLORS[intensity(d.minutes)]}`}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-cf-lo">
          Less
          {HEATMAP_COLORS.map((c, i) => (
            <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
          ))}
          More
        </div>
      </GlassPanel>

      {/* Badges */}
      <GlassPanel>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-cf-warn" />
            <h2 className="font-display font-semibold text-cf-hi">Badges</h2>
          </div>
          <Chip tone="mint">{userBadges.length} / {BADGES.length}</Chip>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {BADGES.map((b, i) => {
            const unlocked = userBadges.includes(b.id);
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
                className={`p-4 rounded-cf-md border text-center ${
                  unlocked ? 'border-cf-warn/40 bg-cf-warn/5' : 'border-cf-line bg-white/[0.02] opacity-50'
                }`}
              >
                <div className={`text-3xl mb-2 ${unlocked ? '' : 'grayscale'}`}>{b.icon}</div>
                <div className={`text-xs font-display font-semibold ${unlocked ? 'text-cf-hi' : 'text-cf-mid'}`}>
                  {b.name}
                </div>
                <div className="text-[10px] text-cf-lo mt-0.5 line-clamp-2">{b.description}</div>
              </motion.div>
            );
          })}
        </div>
      </GlassPanel>

      <div className="mt-10 text-center">
        <button
          onClick={() => { if (confirm('Reset all progress? This cannot be undone.')) reset(); }}
          className="text-xs text-cf-lo hover:text-cf-danger"
        >
          Reset all progress
        </button>
      </div>
    </div>
  );
}
