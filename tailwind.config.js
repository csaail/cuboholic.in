/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/cubeflow/**/*.{js,jsx}'],
  corePlugins: { preflight: false },
  theme: {
    extend: {
      colors: {
        cf: {
          bg0: '#0A0B0F',
          bg1: '#0F1117',
          bg2: '#161922',
          bg3: '#1E2230',
          line: 'rgba(255,255,255,0.08)',
          line2: 'rgba(255,255,255,0.14)',
          hi: '#F4F5FA',
          mid: '#A8AEC1',
          lo: '#6B7180',
          accent: '#6E5BFF',
          accent2: '#00E5C7',
          warn: '#FFB020',
          danger: '#FF5470',
        },
        cube: {
          U: '#FFFFFF',
          D: '#FFD400',
          F: '#009B48',
          B: '#0046AD',
          R: '#B71234',
          L: '#FF5800',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'cf-sm': '8px',
        'cf-md': '14px',
        'cf-lg': '22px',
        'cf-xl': '32px',
      },
      boxShadow: {
        'cf-glow': '0 0 40px -10px rgba(110,91,255,0.55)',
        'cf-glow-mint': '0 0 40px -10px rgba(0,229,199,0.45)',
        'cf-card': '0 8px 24px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset',
      },
      backdropBlur: {
        cf: '14px',
      },
      transitionTimingFunction: {
        'cf-out': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'cf-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'cf-pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(110,91,255,0.6)' },
          '100%': { boxShadow: '0 0 0 14px rgba(110,91,255,0)' },
        },
        'cf-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'cf-shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'cf-pulse-ring': 'cf-pulse-ring 1.6s ease-out infinite',
        'cf-float': 'cf-float 6s ease-in-out infinite',
        'cf-shimmer': 'cf-shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
