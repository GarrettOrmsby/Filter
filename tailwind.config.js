/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2a2438',
        secondary: '#352f44',
        accent: '#5c5470',
        background: '#dbd8e3',
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

