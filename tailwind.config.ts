import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: {
          100: '#F5E8C0',
          200: '#EDDA98',
          300: '#D4B86A',
          400: '#B8944A',
          500: '#9C7A3C',
        },
        ink: {
          100: '#F5F4F0',
          200: '#E8E6E0',
          400: '#9A9890',
          500: '#7A7870',
          600: '#5A5850',
          700: '#3A3830',
          800: '#2A2820',
          900: '#1A1810',
        },
        ivory: '#FAF8F2',
        sand: '#F0E8D8',
      },
      animation: {
        'fade-in': 'fadeIn 1.2s ease forwards',
        'fade-up': 'fadeUp 1.4s ease forwards',
        'breathe': 'breathe 5s ease-in-out infinite',
        'float': 'float 7s ease-in-out infinite',
        'feather-glow': 'featherGlow 0.6s ease forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        fadeUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        breathe: { '0%,100%': { transform: 'scale(1)', opacity: '0.7' }, '50%': { transform: 'scale(1.04)', opacity: '1' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        featherGlow: { from: { filter: 'brightness(1)', transform: 'scale(1)' }, to: { filter: 'brightness(1.4) drop-shadow(0 0 8px rgba(212,184,106,0.8))', transform: 'scale(1.15)' } },
        pulseGold: { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
};

export default config;
