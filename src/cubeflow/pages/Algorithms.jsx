import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Star } from 'lucide-react';
import { ALGORITHMS, METHODS, SETS } from '../data/algorithms.js';
import { useUserStore } from '../store/userStore.js';
import GlassPanel from '../components/ui/GlassPanel.jsx';
import Chip from '../components/ui/Chip.jsx';

export default function Algorithms() {
  const mastered = useUserStore((s) => s.algosMastered);
  const [query, setQuery] = useState('');
  const [method, setMethod] = useState(null);
  const [set, setSet] = useState(null);

  const filtered = useMemo(() => {
    return ALGORITHMS.filter((a) => {
      if (method && a.method !== method) return false;
      if (set && a.set !== set) return false;
      if (query) {
        const q = query.toLowerCase();
        return a.name.toLowerCase().includes(q) || a.notation.toLowerCase().includes(q) || a.set.toLowerCase().includes(q);
      }
      return true;
    });
  }, [query, method, set]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <Chip tone="accent">Library</Chip>
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-cf-hi mt-3">Algorithm library.</h1>
        <p className="mt-3 text-cf-mid max-w-2xl">
          Every algorithm worth knowing — animated, drillable, searchable.
          Tap one to see it in 3D.
        </p>
      </div>

      {/* Search */}
      <GlassPanel className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px] flex items-center gap-2 bg-white/5 rounded-cf-md px-3 py-2 border border-cf-line focus-within:border-cf-accent transition-colors">
            <Search className="w-4 h-4 text-cf-lo" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, notation, or set…"
              className="flex-1 bg-transparent text-sm text-cf-hi placeholder:text-cf-lo focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-cf-lo">
            <Filter className="w-3.5 h-3.5" /> {filtered.length} results
          </div>
        </div>
        {/* Filter chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          <FilterChip active={!method} onClick={() => setMethod(null)}>All methods</FilterChip>
          {METHODS.map((m) => (
            <FilterChip key={m} active={method === m} onClick={() => setMethod(m)}>{m}</FilterChip>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          <FilterChip active={!set} onClick={() => setSet(null)}>All sets</FilterChip>
          {SETS.map((s) => (
            <FilterChip key={s} active={set === s} onClick={() => setSet(s)}>{s}</FilterChip>
          ))}
        </div>
      </GlassPanel>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((a, i) => {
          const isMastered = mastered.includes(a.id);
          return (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.4) }}
            >
              <Link to={`/cubeflow/algorithms/${a.id}`}>
                <GlassPanel hover className="h-full !p-5 group cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <Chip tone={a.method === 'CFOP' ? 'accent' : a.method === 'Beginner' ? 'mint' : 'warn'}>
                          {a.set}
                        </Chip>
                        <span className="text-[10px] uppercase tracking-wider text-cf-lo">
                          {'★'.repeat(a.difficulty)}
                        </span>
                      </div>
                      <h3 className="font-display font-semibold text-lg text-cf-hi group-hover:text-cf-accent transition-colors">
                        {a.name}
                      </h3>
                    </div>
                    {isMastered && <Star className="w-5 h-5 text-cf-warn fill-cf-warn" />}
                  </div>
                  <div className="cf-notation text-sm text-cf-hi bg-cf-bg2 rounded-cf-sm px-3 py-2 border border-cf-line">
                    {a.notation}
                  </div>
                  <p className="text-xs text-cf-mid mt-3 line-clamp-2">{a.description}</p>
                </GlassPanel>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-cf-mid">
          No algorithms match those filters.
        </div>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
        active
          ? 'bg-cf-accent text-white border-cf-accent shadow-cf-glow'
          : 'bg-white/5 text-cf-mid border-cf-line hover:border-cf-line2 hover:text-cf-hi'
      }`}
    >
      {children}
    </button>
  );
}
