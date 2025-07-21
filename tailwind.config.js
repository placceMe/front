/** @type {import('tailwindcss').Config} */
import { COLORS } from './src/shared/constants/theme';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: { 
            fontFamily: {
        montserrat: ['Montserrat', 'Arial', 'sans-serif'],
        'montserrat-semibold': ['Montserrat Semibold', 'Montserrat', 'sans-serif'],
        'montserrat-regular': ['Montserrat Regular', 'Montserrat', 'sans-serif'],
        'montserrat-bold': ['Montserrat Bold', 'Montserrat', 'sans-serif'],
      },
      fontWeight: {
        semibold: FONTS.weight.semibold,
        bold: FONTS.weight.bold,
        regular: FONTS.weight.regular,
      },
     colors: {
        ...COLORS,
      },
      
},
    },
    plugins: [],
};
