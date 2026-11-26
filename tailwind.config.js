/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Every token is driven by a CSS variable so the whole site can flip
        // between the light editorial theme and its dark counterpart.
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          soft: 'rgb(var(--ink-soft) / <alpha-value>)',
          faint: 'rgb(var(--ink-faint) / <alpha-value>)',
          line: 'rgb(var(--ink-line) / <alpha-value>)',
        },
        canvas: 'rgb(var(--canvas) / <alpha-value>)',
        cream: 'rgb(var(--cream) / <alpha-value>)',
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          deep: 'rgb(var(--accent-deep) / <alpha-value>)',
          tint: 'rgb(var(--accent-tint) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        serif: ['Instrument Serif', 'Georgia', 'Times New Roman', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
      boxShadow: {
        xs: 'var(--shadow-xs)',
        soft: 'var(--shadow-soft)',
        lift: 'var(--shadow-lift)',
        glow: 'var(--shadow-glow)',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translate3d(0,18px,0)' },
          '100%': { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        marquee: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-50%,0,0)' },
        },
        'drift-a': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1)' },
          '50%': { transform: 'translate3d(4%,-3%,0) scale(1.08)' },
        },
        'drift-b': {
          '0%,100%': { transform: 'translate3d(0,0,0) scale(1.06)' },
          '50%': { transform: 'translate3d(-5%,4%,0) scale(1)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-8px,0)' },
        },
        sheen: {
          '0%': { backgroundPosition: '220% center' },
          '100%': { backgroundPosition: '-220% center' },
        },
        'ring-pulse': {
          '0%': { transform: 'scale(0.85)', opacity: '0.6' },
          '70%': { transform: 'scale(2.2)', opacity: '0' },
          '100%': { transform: 'scale(2.2)', opacity: '0' },
        },
        'spin-slow': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'logo-spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
        'dot-bounce': {
          '0%,80%,100%': { transform: 'translate3d(0,0,0)', opacity: '0.35' },
          '40%': { transform: 'translate3d(0,-4px,0)', opacity: '1' },
        },
        'aurora-breathe': {
          '0%,100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.85' },
          '50%': { transform: 'scale(1.06) rotate(3deg)', opacity: '1' },
        },
        'aurora-breathe-rev': {
          '0%,100%': { transform: 'scale(1.04) rotate(0deg)', opacity: '0.7' },
          '50%': { transform: 'scale(0.98) rotate(-4deg)', opacity: '1' },
        },
        'gradient-pan': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        'logo-grow': {
          '0%,100%': { transform: 'scale(0.92)' },
          '50%': { transform: 'scale(1.08)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translate3d(0,12px,0)' },
          '100%': { opacity: '1', transform: 'translate3d(0,0,0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.6s ease both',
        marquee: 'marquee 46s linear infinite',
        'drift-a': 'drift-a 26s ease-in-out infinite',
        'drift-b': 'drift-b 32s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        sheen: 'sheen 7s linear infinite',
        'ring-pulse': 'ring-pulse 2.6s cubic-bezier(0.16,1,0.3,1) infinite',
        'spin-slow': 'spin-slow 28s linear infinite',
        'logo-spin': 'logo-spin 90s linear infinite',
        'dot-bounce': 'dot-bounce 1.2s ease-in-out infinite',
        'aurora-breathe': 'aurora-breathe 14s ease-in-out infinite',
        'aurora-breathe-rev': 'aurora-breathe-rev 18s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 16s ease infinite',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'logo-grow': 'logo-grow 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
