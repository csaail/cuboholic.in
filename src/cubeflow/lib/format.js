export function formatTime(ms) {
  if (ms == null || isNaN(ms)) return '—';
  const totalCs = Math.floor(ms / 10);
  const minutes = Math.floor(totalCs / 6000);
  const seconds = Math.floor((totalCs % 6000) / 100);
  const cs = totalCs % 100;
  if (minutes > 0) {
    return `${minutes}:${String(seconds).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }
  return `${seconds}.${String(cs).padStart(2, '0')}`;
}

export function formatTimeShort(ms) {
  if (ms == null) return '—';
  return (ms / 1000).toFixed(2);
}

export function ao(times, n) {
  // WCA average of n: drop best + worst, mean the rest.
  if (times.length < n) return null;
  const slice = times.slice(-n);
  const sorted = [...slice].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, -1);
  return trimmed.reduce((s, t) => s + t, 0) / trimmed.length;
}

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function daysBetween(aIso, bIso) {
  const a = new Date(aIso);
  const b = new Date(bIso);
  return Math.round((b - a) / 86400000);
}

export function classNames(...args) {
  return args.filter(Boolean).join(' ');
}
