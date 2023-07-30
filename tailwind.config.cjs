import plugin from 'tailwindcss/plugin'
import typography from '@tailwindcss/typography'
import forms from '@tailwindcss/forms'

/** @type {import('tailwindcss').Config}*/
const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
      extend: {
         colors: {
            'orange': {
               50: '#FFF2EE',
               100: '#FFDBD1',
               200: '#FFC7B7',
               300: '#FFAF9B',
               400: '#FF977D',
               500: '#FF8E72',
               600: '#FF7A59',
               700: '#FF6C47',
               800: '#FF5621',
               900: '#FF460C'
            }
         }
      }
  },

   plugins: [
      typography,
      forms,
      plugin(function ({ addVariant, matchUtilities, theme }) {
         addVariant('hocus', ['&:hover', '&:focus']);
         // Square utility
         matchUtilities({
             square: (value) => ({
               width: value,
               height: value,
             }),
           },
           { values: theme('spacing') }
         );
      })
   ]
}

module.exports = config
