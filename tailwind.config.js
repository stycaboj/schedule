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
      'select-gray': '#D9D9D9',
      'f-gray': '#989898',
      'c-gray': '#4C4C4C',
      'f-black': '#1C1C1C',
    },
    extend: {
      margin: {
        '25': '1.5625rem',
      },
      boxShadow: {
        'card': '0 3px 10px 2px rgba(218,218,218,1)',
      },
    },
  },
  plugins: [],
}