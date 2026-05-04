import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:         '#06080d',
        surface:    '#0c0f18',
        card:       '#10141f',
        primary:    '#B197FC',
        'primary-dark': '#8B6FE0',
        accent:     '#64E4CC',
        gold:       '#F5C842',
        danger:     '#FF6B6B',
        muted:      '#6B7280',
        faint:      '#3D4451',
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'spin-slow':   'spin 8s linear infinite',
        'pulse-glow':  'pulseGlow 3s ease-in-out infinite',
        'float':       'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(177,151,252,0.1)' },
          '50%':      { boxShadow: '0 0 60px rgba(177,151,252,0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-brand':  'linear-gradient(135deg, #B197FC 0%, #64E4CC 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

export default config
