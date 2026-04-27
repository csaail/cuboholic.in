import { classNames } from '../../lib/format.js';

export default function GlassPanel({ children, className, padded = true, hover = false, ...rest }) {
  return (
    <div
      className={classNames(
        'cf-glass rounded-cf-lg',
        padded && 'p-5 sm:p-6',
        hover && 'transition-all duration-300 ease-cf-out hover:border-cf-line2 hover:bg-white/[0.06]',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
