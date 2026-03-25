import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-deep': '#0A0B0F',
        'bg-card': 'rgba(255,255,255,0.03)',
        'bg-glass': 'rgba(255,255,255,0.04)',
        'gold': '#C8A55A',
        'gold-light': '#E4CC8A',
        'gold-dim': 'rgba(200,165,90,0.15)',
        'text-primary': '#F0EDE6',
        'text-secondary': 'rgba(240,237,230,0.55)',
        'text-muted': 'rgba(240,237,230,0.3)',
        'border-subtle': 'rgba(255,255,255,0.06)',
        'accent-red': '#E05555',
        'accent-green': '#4ECB71',
      },
      fontFamily: {
        'serif': ['Cormorant Garamond', 'serif'],
        'sans': ['Onest', 'sans-serif'],
      },
      fontSize: {
        'hero': 'clamp(40px, 6.5vw, 80px)',
        'section': 'clamp(32px, 5vw, 52px)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h80v80H0z' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='1'/%3E%3C/svg%3E\")",
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
} satisfies Config
