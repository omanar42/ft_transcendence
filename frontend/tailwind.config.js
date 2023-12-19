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
        160: '160rem',
        170: '170rem',
      },
      width:{
        '5rem': '5rem',
        '10rem': '10rem',
        '20rem': '20rem',
        '30rem': '30rem',
        140: '140rem',
        150: '150rem',
        '40rem': '40rem',
      },
      height: {
        50: '50rem',
        60: '60rem',
        70: '70rem',
        100: '100rem',
        120: '120rem',
      },
      colors:{
        dark: '#13140e',
        'dark-100': '#2b2c26',
        'dark-200': '#2b2c26',
        'dark-300': '#42433e',
        'pink-100': '#953e91',
        'blue-100': '#1C00CBB2'
      },
      letterSpacing: {
        '1': '0em',
        '2': '0.025em',
        '3': '0.05em',
        '4': '0.1em',
      },
      fontFamily: {
        Orbitron: ['Orbitron']
      }
    },
  },
  plugins: [],
}