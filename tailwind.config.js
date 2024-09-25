/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      'white': '#FFFFFF',
      'gray': '#F9F9FA',
      'light-gray': '#F7F7F7',
      's-gray': '#DADADA',
      'black': '#303030',
      'dark-black': '#282828',
      'red': '#FF0000',
    },
    extend: {
      margin: {
        '25': '1.5625rem',
      }
    },
  },
  plugins: [],
}