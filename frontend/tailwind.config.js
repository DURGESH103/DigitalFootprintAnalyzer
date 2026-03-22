/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#0d1117',
          secondary: '#161b22',
          tertiary:  '#21262d',
          card:      '#1c2128',
        },
        brand: {
          DEFAULT: '#58a6ff',
          dim:     '#1f6feb',
          glow:    'rgba(88,166,255,0.15)',
        },
        accent: {
          green:  '#3fb950',
          purple: '#bc8cff',
          orange: '#f78166',
          yellow: '#e3b341',
          cyan:   '#39d0d8',
        },
        border: {
          DEFAULT: '#30363d',
          bright:  '#484f58',
        },
        text: {
          primary:   '#e6edf3',
          secondary: '#8b949e',
          muted:     '#484f58',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow':        'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(88,166,255,0.15), transparent)',
        'card-shine':       'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 60%)',
        'brand-gradient':   'linear-gradient(135deg, #58a6ff 0%, #bc8cff 100%)',
        'green-gradient':   'linear-gradient(135deg, #3fb950 0%, #58a6ff 100%)',
      },
      animation: {
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':        'float 6s ease-in-out infinite',
        'shimmer':      'shimmer 1.8s linear infinite',
        'fade-up':      'fade-up 0.4s ease-out forwards',
        'success-pop':  'success-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'pulse-ring':   'pulse-ring 1.5s ease-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'success-pop': {
          '0%':   { transform: 'scale(0)', opacity: '0' },
          '60%':  { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'pulse-ring': {
          '0%':   { boxShadow: '0 0 0 0 rgba(88,166,255,0.4)' },
          '70%':  { boxShadow: '0 0 0 10px rgba(88,166,255,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(88,166,255,0)' },
        },
      },
      boxShadow: {
        'glow-brand':  '0 0 20px rgba(88,166,255,0.3)',
        'glow-green':  '0 0 20px rgba(63,185,80,0.3)',
        'glow-purple': '0 0 20px rgba(188,140,255,0.3)',
        'card':        '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover':  '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(88,166,255,0.15)',
        'inner-top':   'inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
};
