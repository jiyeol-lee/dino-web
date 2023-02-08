/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true
    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    },
    extend: {
      fontFamily: {
        lato: ['Lato', 'sans-serif']
      },
      zIndex: {
        'app-toolbar': 1300,
        'drawer-left': 1200,
        'drawer-right': 1400,
        'global-loading': 2000
      },
      colors: {
        current: 'currentColor',
        transparent: 'transparent',
        white: colors.white,
        black: colors.black,
        gray: colors.gray,
        'surface-0': colors.neutral[50],
        'dark-surface-0': colors.neutral[900],
        'surface-1': colors.neutral[100],
        'dark-surface-1': colors.neutral[800],
        'surface-2': colors.neutral[200],
        'dark-surface-2': colors.neutral[700],
        primary: {
          DEFAULT: colors.indigo[700],
          hover: colors.indigo[800],
          dark: colors.indigo[600],
          'dark-hover': colors.indigo[700]
        },
        secondary: {
          DEFAULT: colors.purple[700],
          hover: colors.purple[900],
          dark: colors.purple[600],
          'dark-hover': colors.purple[700]
        },
        success: {
          DEFAULT: colors.green[700],
          hover: colors.green[900],
          dark: colors.green[600],
          'dark-hover': colors.green[700]
        },
        danger: {
          DEFAULT: colors.red[700],
          hover: colors.red[900],
          dark: colors.red[600],
          'dark-hover': colors.red[700]
        },
        warning: {
          DEFAULT: colors.yellow[700],
          hover: colors.yellow[900],
          dark: colors.yellow[600],
          'dark-hover': colors.yellow[700]
        },
        info: {
          DEFAULT: colors.orange[700],
          hover: colors.orange[900],
          dark: colors.orange[600],
          'dark-hover': colors.orange[700]
        }
      }
    }
  },
  plugins: []
}
