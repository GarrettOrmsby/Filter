/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        backgroundColor: '#14181c',
        headingColor: '#fff',
        paragraphColor: '#9ab',
        lighterGray: '#333f44',
        darkTeal: '#37aa9c',
        lightTeal: '#94f3e4',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '104': '1.04',
      }
    },
  },
  plugins: [],
}

