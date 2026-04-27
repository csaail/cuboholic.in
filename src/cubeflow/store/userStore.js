import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { todayKey, daysBetween } from '../lib/format.js';

const xpForLevel = (n) => Math.floor(100 * Math.pow(n, 1.6));

function deriveLevel(xp) {
  let lvl = 1;
  while (xp >= xpForLevel(lvl + 1)) lvl++;
  return lvl;
}

export const useUserStore = create(
  persist(
    (set, get) => ({
      handle: 'cuber',
      displayName: 'New Cuber',
      avatarSeed: Math.floor(Math.random() * 9999),
      xp: 0,
      lessonsCompleted: [],
      algosMastered: [],
      streak: { count: 0, lastActiveDate: null },
      heatmap: {}, // { 'YYYY-MM-DD': { solves, minutes, xp } }
      badges: [],
      onboarded: false,

      get level() {
        return deriveLevel(get().xp);
      },

      setHandle: (handle) => set({ handle }),
      setDisplayName: (displayName) => set({ displayName }),
      completeOnboarding: () => set({ onboarded: true }),

      addXp: (amount) => {
        const today = todayKey();
        set((s) => ({
          xp: s.xp + amount,
          heatmap: {
            ...s.heatmap,
            [today]: {
              ...(s.heatmap[today] || { solves: 0, minutes: 0, xp: 0 }),
              xp: (s.heatmap[today]?.xp || 0) + amount,
            },
          },
        }));
        get().touchStreak();
      },

      completeLesson: (lessonId, rewardXp = 0) => {
        const s = get();
        if (s.lessonsCompleted.includes(lessonId)) return;
        set({ lessonsCompleted: [...s.lessonsCompleted, lessonId] });
        if (rewardXp) get().addXp(rewardXp);
      },

      masterAlgo: (algoId) => {
        const s = get();
        if (s.algosMastered.includes(algoId)) return;
        set({ algosMastered: [...s.algosMastered, algoId] });
        get().addXp(75);
      },

      logSolve: ({ ms }) => {
        const today = todayKey();
        set((s) => ({
          heatmap: {
            ...s.heatmap,
            [today]: {
              solves: (s.heatmap[today]?.solves || 0) + 1,
              minutes: (s.heatmap[today]?.minutes || 0) + ms / 60000,
              xp: s.heatmap[today]?.xp || 0,
            },
          },
        }));
        get().addXp(5);
      },

      touchStreak: () => {
        const today = todayKey();
        const s = get();
        const last = s.streak.lastActiveDate;
        if (last === today) return;
        if (!last) {
          set({ streak: { count: 1, lastActiveDate: today } });
          return;
        }
        const gap = daysBetween(last, today);
        if (gap === 1) set({ streak: { count: s.streak.count + 1, lastActiveDate: today } });
        else if (gap > 1) set({ streak: { count: 1, lastActiveDate: today } });
      },

      unlockBadge: (badgeId) => {
        const s = get();
        if (s.badges.includes(badgeId)) return;
        set({ badges: [...s.badges, badgeId] });
      },

      reset: () =>
        set({
          xp: 0,
          lessonsCompleted: [],
          algosMastered: [],
          streak: { count: 0, lastActiveDate: null },
          heatmap: {},
          badges: [],
          onboarded: false,
        }),
    }),
    {
      name: 'cubeflow-user',
      version: 1,
    },
  ),
);

export { xpForLevel, deriveLevel };
