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
        saffron: '#FF9933',
        'india-green': '#138808',
        'bjp-blue': '#0066B3',
        'gov-orange': '#FF6600',
      },
      fontFamily: {
        devanagari: ['var(--font-devanagari)'],
      },
    },
  },
  plugins: [],
}