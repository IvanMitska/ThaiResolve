import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: '#F2F1EC',
        'paper-dim': '#EAE9E2',
        'paper-card': '#FBFAF6',
        ink: '#0D0F0E',
        'ink-soft': '#151715',
        accent: '#0E7A4B',
        'accent-light': '#15A865',
        'accent-dark': '#0A5C39',
        'text-primary': '#0D0F0E',
        'text-secondary': '#555851',
        'text-muted': '#8B8D82',
        line: '#D7D5CB',
        'line-soft': '#E4E2D9',
      },
      fontFamily: {
        'display': ['PP Neue Montreal', 'Schibsted Grotesk', 'sans-serif'],
        'sans': ['Schibsted Grotesk', 'sans-serif'],
      },
      fontSize: {
        'mega': 'clamp(4.5rem, 18vw, 18rem)',
        'display': 'clamp(3rem, 10vw, 9rem)',
        'h1': 'clamp(2.25rem, 6vw, 5rem)',
        'h2': 'clamp(2rem, 4.5vw, 3.5rem)',
      },
      transitionTimingFunction: {
        'expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
