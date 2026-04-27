import { motion } from 'framer-motion';

export default function ProgressRing({
  value = 0,
  max = 100,
  size = 120,
  stroke = 10,
  color = '#6E5BFF',
  trackColor = 'rgba(255,255,255,0.08)',
  label,
  sublabel,
}) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(1, value / max));
  const dash = circ * pct;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - dash }}
          transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${color}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {label && <div className="font-display text-xl font-bold text-cf-hi">{label}</div>}
        {sublabel && <div className="text-[10px] uppercase tracking-wider text-cf-lo mt-0.5">{sublabel}</div>}
      </div>
    </div>
  );
}
