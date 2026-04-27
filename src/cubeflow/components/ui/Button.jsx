import { motion } from 'framer-motion';
import { classNames } from '../../lib/format.js';

const VARIANTS = {
  primary: 'bg-cf-accent text-white hover:shadow-cf-glow',
  secondary: 'cf-glass text-cf-hi hover:border-cf-line2',
  ghost: 'text-cf-mid hover:text-cf-hi hover:bg-white/5',
  mint: 'bg-cf-accent2 text-cf-bg0 hover:shadow-cf-glow-mint',
  danger: 'bg-cf-danger text-white',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  icon: Icon,
  iconRight: IconRight,
  loading,
  ...rest
}) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 600, damping: 30 }}
      className={classNames(
        'inline-flex items-center gap-2 rounded-cf-md font-medium transition-all duration-200 ease-cf-out disabled:opacity-50 disabled:pointer-events-none',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...rest}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {loading ? '…' : children}
      {IconRight && <IconRight className="w-4 h-4" />}
    </motion.button>
  );
}
