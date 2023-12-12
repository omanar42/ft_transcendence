/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth:{
        120: '120rem',
        130: '130rem',
        140: '140rem',
        150: '150rem',
      },
      width:{
        '5rem': '5rem',
        '10rem': '10rem',
        '20rem': '20rem',
        '30rem': '30rem',
        '40rem': '40rem',
      },
      colors:{
        dark: '#13140e',
        'dark-100': '#2b2c26',
        'dark-200': '#2b2c26',
        'dark-300': '#42433e',
        'pink-100': '#F400CD80',
        'blue-100': '#1C00CBB2'
      },
      letterSpacing: {
        '1': '0em',
        '2': '0.025em',
        '3': '0.05em',
        '4': '0.1em',
      }
    },
  },
  plugins: [],
}