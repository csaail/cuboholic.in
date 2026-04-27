import { classNames } from '../../lib/format.js';
import GlassPanel from './GlassPanel.jsx';

export default function StatTile({ label, value, sublabel, icon: Icon, accent = 'accent', className }) {
  const accentColor = accent === 'mint' ? 'text-cf-accent2' : accent === 'warn' ? 'text-cf-warn' : 'text-cf-accent';
  return (
    <GlassPanel className={classNames('flex flex-col gap-1.5', className)} padded hover>
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-cf-lo">{label}</span>
        {Icon && <Icon className={classNames('w-4 h-4', accentColor)} />}
      </div>
      <div className="font-display text-3xl font-bold text-cf-hi tabular-nums">{value}</div>
      {sublabel && <div className="text-xs text-cf-mid">{sublabel}</div>}
    </GlassPanel>
  );
}
