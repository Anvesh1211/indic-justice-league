/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government / Judicial palette (semantic tokens)
        'gov-primary': colors.slate[900],
        'gov-primary-900': colors.slate[900],
        'gov-primary-800': colors.slate[800],
        'gov-bg-muted': colors.gray[50],
        'gov-panel-bg': colors.slate[50],
        'gov-border': colors.slate[200],
        'gov-judicial-blue': '#0B3B5E',
        'gov-emerald': colors.emerald[600],
        'gov-amber': colors.amber[500],
        'gov-rose-muted': colors.rose[600]
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'Helvetica', 'Arial'],
        serif: ['Merriweather', 'serif']
      },
      borderRadius: {
        'xl': '1rem'
      },
      boxShadow: {
        panel: '0 1px 6px rgba(2,6,23,0.06)',
        'panel-md': '0 4px 14px rgba(2,6,23,0.08)'
      },
      spacing: {
        '18': '4.5rem'
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.800'),
            a: {
              color: theme('colors.gov-judicial-blue'),
              textDecoration: 'underline'
            },
            h1: { color: theme('colors.slate.900'), letterSpacing: '0.02em' },
            h2: { color: theme('colors.slate.900') },
            h3: { color: theme('colors.slate.800') }
          }
        }
      })
    }
  },
  plugins: [],
}