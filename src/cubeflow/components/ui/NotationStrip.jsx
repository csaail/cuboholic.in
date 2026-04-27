import { motion } from 'framer-motion';
import { parseNotation, moveToString } from '../../lib/cube/notation.js';

export default function NotationStrip({ notation, activeIndex = -1 }) {
  const moves = parseNotation(notation);
  return (
    <div className="flex flex-wrap gap-1.5">
      {moves.map((m, i) => {
        const isActive = i === activeIndex;
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className={`cf-notation px-2 py-1 rounded-cf-sm text-sm border transition-colors ${
              isActive
                ? 'bg-cf-accent/30 text-white border-cf-accent shadow-cf-glow'
                : 'bg-white/5 text-cf-hi border-cf-line'
            }`}
          >
            {moveToString(m)}
          </motion.span>
        );
      })}
    </div>
  );
}
