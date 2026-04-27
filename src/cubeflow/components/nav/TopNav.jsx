import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Box, Flame, Sparkles } from 'lucide-react';
import { useUserStore, deriveLevel, xpForLevel } from '../../store/userStore.js';

const LINKS = [
  { to: '/cubeflow/learn', label: 'Learn' },
  { to: '/cubeflow/algorithms', label: 'Algorithms' },
  { to: '/cubeflow/solver', label: 'Solver' },
  { to: '/cubeflow/timer', label: 'Timer' },
  { to: '/cubeflow/community', label: 'Community' },
];

export default function TopNav() {
  const location = useLocation();
  const xp = useUserStore((s) => s.xp);
  const streak = useUserStore((s) => s.streak.count);
  const onboarded = useUserStore((s) => s.onboarded);
  const level = deriveLevel(xp);
  const nextLevelXp = xpForLevel(level + 1);
  const prevLevelXp = xpForLevel(level);
  const pct = Math.min(100, ((xp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100);

  const isLanding = location.pathname === '/cubeflow' || location.pathname === '/cubeflow/';

  return (
    <header className="sticky top-0 z-50 cf-glass border-b border-cf-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/cubeflow" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ type: 'spring', stiffness: 200, damping: 12 }}
            className="w-9 h-9 rounded-cf-md bg-gradient-to-br from-cf-accent to-cf-accent2 flex items-center justify-center shadow-cf-glow"
          >
            <Box className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="font-display font-bold text-base text-cf-hi">CubeFlow</span>
            <span className="text-[10px] text-cf-lo tracking-wide">free • interactive • visual</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-cf-sm text-sm font-medium transition-colors ${
                  isActive ? 'text-cf-hi bg-white/5' : 'text-cf-mid hover:text-cf-hi'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {onboarded && (
            <>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-cf-mid">
                <Flame className={`w-4 h-4 ${streak > 0 ? 'text-cf-warn' : 'text-cf-lo'}`} />
                <span className="font-mono tabular-nums">{streak}</span>
              </div>
              <Link
                to="/cubeflow/profile"
                className="hidden sm:flex items-center gap-2 cf-glass rounded-full pl-2 pr-3 py-1 hover:border-cf-line2 transition-colors"
              >
                <div className="relative w-7 h-7 rounded-full bg-gradient-to-br from-cf-accent to-cf-accent2 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">L{level}</span>
                </div>
                <div className="text-xs font-mono text-cf-mid tabular-nums">{xp} XP</div>
              </Link>
            </>
          )}
          {!onboarded && !isLanding && (
            <Link
              to="/cubeflow/onboarding"
              className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-cf-sm bg-cf-accent text-white font-medium hover:shadow-cf-glow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Get started
            </Link>
          )}
        </div>
      </div>
      {onboarded && (
        <div className="h-0.5 bg-cf-bg2">
          <motion.div
            className="h-full bg-gradient-to-r from-cf-accent to-cf-accent2"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
          />
        </div>
      )}
    </header>
  );
}
