const defaultTheme = require('tailwindcss/defaultTheme')

const fontFamily = defaultTheme.fontFamily;
fontFamily['sans'] = [
  'Montserrat', // <-- Roboto is a default sans font now
  'Poppins',
];
fontFamily['serif'] = [
  'Montserrat', // <-- Roboto is a default sans font now
  'Poppins',
];


module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    fontFamily: fontFamily,
    screens: {
      'xs': '360px',
      ...defaultTheme.screens,
    },
    extend:{
      colors: {
        'primary': 'var(--ion-color-primary)',
        'primary-tint': 'var(--ion-color-primary-tint)',
        'primary-shade': 'var(--ion-color-primary-shade)',
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};