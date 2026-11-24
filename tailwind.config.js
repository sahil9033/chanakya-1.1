/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#16171D',
          soft: '#5A5D6B',
          faint: '#8C8F9B',
          line: '#EAE8E3',
        },
        canvas: '#FFFFFF',
        cream: '#FAF8F4',
        accent: {
          DEFAULT: '#FF6A2B',
          deep: '#B0450B',
          tint: '#FFF4ED',
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
        xs: '0 1px 2px rgba(22,23,29,0.05)',
        soft: '0 1px 2px rgba(22,23,29,0.04), 0 10px 30px -12px rgba(22,23,29,0.12)',
        lift: '0 2px 4px rgba(22,23,29,0.04), 0 28px 60px -20px rgba(22,23,29,0.22)',
        glow: '0 0 0 1px rgba(255,106,43,0.16), 0 18px 50px -18px rgba(255,106,43,0.45)',
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
        'dot-bounce': {
          '0%,80%,100%': { transform: 'translate3d(0,0,0)', opacity: '0.35' },
          '40%': { transform: 'translate3d(0,-4px,0)', opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.6s ease both',
        marquee: 'marquee 46s linear infinite',
        'drift-a': 'drift-a 24s ease-in-out infinite',
        'drift-b': 'drift-b 30s ease-in-out infinite',
        'float-slow': 'float-slow 7s ease-in-out infinite',
        sheen: 'sheen 7s linear infinite',
        'ring-pulse': 'ring-pulse 2.6s cubic-bezier(0.16,1,0.3,1) infinite',
        'spin-slow': 'spin-slow 28s linear infinite',
        'dot-bounce': 'dot-bounce 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
