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
  purge: [
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
        'cg': '#00FFA3',
        'cb': '#03E1FF',
        'cp': '#DC1FFF',
        'cbl': '#101921',
        'cbg': 'rgb(16, 25, 33,0.2)',
        'cbgld': 'rgb(16, 25, 33,0.4)',
        'cbgmd': 'rgb(16, 25, 33,0.6)',
        'cbgd': 'rgb(16, 25, 33,0.8)',
        'tp': '#DC1FFF',
        'tg': '#00FFA3',
        'bg-primary': '#36393f',
        'bg-secondary': '#2f3136',
        'bg-tertiary': '#202225',
        'satin-1' :'rgba(0,0,0,0.1)',
        'satin-2' :'rgba(0,0,0,0.2)',
        'satin-3' :'rgba(0,0,0,0.3)',
        'satin-4' :'rgba(0,0,0,0.4)',
        'satin-5' :'rgba(0,0,0,0.5)',
        'satin-6' :'rgba(0,0,0,0.6)',
        'satin-7' :'rgba(0,0,0,0.7)',
        'satin-8' :'rgba(0,0,0,0.8)',
        'satin-9' :'rgba(0,0,0,0.9)',
        'primary' :'#7ED957',
        'secondary' : '#8C52FF',
        'background': '#3B5C6E',
        'card': '#1f2e3c',
        'text': '#FFFFFF'
      },
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};