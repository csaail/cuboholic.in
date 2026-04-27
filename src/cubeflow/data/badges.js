// Achievement badges. Unlocked via stats events.

export const BADGES = [
  { id: 'first-solve', name: 'First Solve', icon: '🥇', description: 'Complete your first solve.', test: (s) => s.totalSolves >= 1 },
  { id: 'first-lesson', name: 'Curious Mind', icon: '📚', description: 'Finish your first lesson.', test: (s) => s.lessonsDone >= 1 },
  { id: 'algo-apprentice', name: 'Algo Apprentice', icon: '🎓', description: 'Learn 10 algorithms.', test: (s) => s.algosLearned >= 10 },
  { id: 'oll-complete', name: 'OLL Master', icon: '🏆', description: 'Learn every OLL algorithm.', test: (s) => s.ollLearned >= 57 },
  { id: 'pll-complete', name: 'PLL Master', icon: '👑', description: 'Learn every PLL algorithm.', test: (s) => s.pllLearned >= 21 },
  { id: 'sub-60', name: 'Sub-60', icon: '⚡', description: 'Solve in under 60 seconds.', test: (s) => s.bestSingle && s.bestSingle < 60000 },
  { id: 'sub-30', name: 'Sub-30', icon: '⚡⚡', description: 'Solve in under 30 seconds.', test: (s) => s.bestSingle && s.bestSingle < 30000 },
  { id: 'sub-20', name: 'Sub-20', icon: '🚀', description: 'Solve in under 20 seconds.', test: (s) => s.bestSingle && s.bestSingle < 20000 },
  { id: 'sub-15', name: 'Sub-15', icon: '💎', description: 'Solve in under 15 seconds.', test: (s) => s.bestSingle && s.bestSingle < 15000 },
  { id: 'sub-10', name: 'Sub-10', icon: '👽', description: 'Solve in under 10 seconds.', test: (s) => s.bestSingle && s.bestSingle < 10000 },
  { id: 'centurion', name: 'Centurion', icon: '💯', description: 'Complete 100 timed solves.', test: (s) => s.totalSolves >= 100 },
  { id: 'week-warrior', name: 'Week Warrior', icon: '🔥', description: 'Maintain a 7-day streak.', test: (s) => s.streak >= 7 },
  { id: 'month-master', name: 'Month Master', icon: '🌟', description: 'Maintain a 30-day streak.', test: (s) => s.streak >= 30 },
  { id: 'ao5-master', name: 'Consistency', icon: '📊', description: 'Sub-60 average of 5.', test: (s) => s.bestAo5 && s.bestAo5 < 60000 },
  { id: 'speedrunner', name: 'Speedrunner', icon: '🏃', description: 'Sub-30 average of 12.', test: (s) => s.bestAo12 && s.bestAo12 < 30000 },
];

export function evaluateBadges(stats) {
  return BADGES.filter((b) => b.test(stats)).map((b) => b.id);
}

export function getBadge(id) {
  return BADGES.find((b) => b.id === id);
}
