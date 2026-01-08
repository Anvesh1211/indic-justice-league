/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'judicial-blue': '#0F172A',
        'paper-white': '#F8FAFC',
        'polygon-purple': '#8247E5',
        'crimson-red': '#EF4444',
        'slate-grey': '#334155',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Merriweather', 'serif'],
        sans: ['Inter', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
          'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
