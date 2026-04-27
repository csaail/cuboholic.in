import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ao } from '../lib/format.js';

export const useTimerStore = create(
  persist(
    (set, get) => ({
      solves: [], // { id, ms, scramble, dnf, plus2, createdAt }
      currentScramble: null,

      setScramble: (scramble) => set({ currentScramble: scramble }),

      addSolve: (solve) => {
        set((s) => ({ solves: [...s.solves, { id: Date.now(), createdAt: Date.now(), ...solve }] }));
      },

      togglePlus2: (id) => {
        set((s) => ({
          solves: s.solves.map((sv) => (sv.id === id ? { ...sv, plus2: !sv.plus2, ms: sv.plus2 ? sv.ms - 2000 : sv.ms + 2000 } : sv)),
        }));
      },

      toggleDnf: (id) => {
        set((s) => ({
          solves: s.solves.map((sv) => (sv.id === id ? { ...sv, dnf: !sv.dnf } : sv)),
        }));
      },

      removeSolve: (id) => {
        set((s) => ({ solves: s.solves.filter((sv) => sv.id !== id) }));
      },

      clear: () => set({ solves: [] }),

      get bestSingle() {
        const valid = get().solves.filter((s) => !s.dnf);
        if (!valid.length) return null;
        return Math.min(...valid.map((s) => s.ms));
      },

      get bestAo5() {
        const valid = get().solves.filter((s) => !s.dnf).map((s) => s.ms);
        return ao(valid, 5);
      },

      get bestAo12() {
        const valid = get().solves.filter((s) => !s.dnf).map((s) => s.ms);
        return ao(valid, 12);
      },
    }),
    { name: 'cubeflow-timer', version: 1 },
  ),
);
