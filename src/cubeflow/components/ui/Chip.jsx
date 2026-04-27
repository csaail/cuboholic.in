import { classNames } from '../../lib/format.js';

const TONES = {
  default: 'bg-white/5 text-cf-mid border-cf-line',
  accent: 'bg-cf-accent/15 text-cf-accent border-cf-accent/30',
  mint: 'bg-cf-accent2/15 text-cf-accent2 border-cf-accent2/30',
  warn: 'bg-cf-warn/15 text-cf-warn border-cf-warn/30',
  danger: 'bg-cf-danger/15 text-cf-danger border-cf-danger/30',
};

export default function Chip({ children, tone = 'default', className, ...rest }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        TONES[tone],
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
