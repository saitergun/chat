const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

console.log(`\ntailwind => ${process.env.NODE_ENV}\n`);

// https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
module.exports = {
  theme: {
    fontSize: {
      '128/16': '8rem', // 9xl
      '96/16': '6rem', // 8xl
      '72/16': '4.5rem', // 7xl
      '60/16': '3.75rem', // 6xl
      '48/16': '3rem', // 5xl
      '36/16': '2.25rem', // 4xl

      '32/16': '2rem',
      '31/16': '1.938rem',
      '30/16': '1.875rem', // 3xl
      '29/16': '1.813rem',
      '28/16': '1.75rem',
      '27/16': '1.688rem',
      '26/16': '1.625rem',
      '25/16': '1.563rem',
      '24/16': '1.5rem', // 2xl
      '23/16': '1.438rem',
      '22/16': '1.375rem',
      '21/16': '1.313rem',
      '20/16': '1.25rem', // xl
      '19/16': '1.188rem',
      '18/16': '1.125rem', // lg
      '17/16': '1.063rem',

      '16/16': '1rem', // base
      '15/16': '.938rem',
      '14/16': '.875rem', // sm
      '13/16': '.813rem',
      '12/16': '.75rem', // xs
      '11/16': '.688rem',
      '10/16': '.625rem',
      '9/16': '.563rem',
      '8/16': '.5rem',
      '7/16': '.438rem',
      '6/16': '.375rem',
      '5/16': '.313rem',
      '4/16': '.25rem',
      '3/16': '.188rem',
      '2/16': '.125rem',
      '1/16': '.063rem',
    },

    fontWeight: {
      '100': 100,
      '200': 200,
      '300': 300,
      '400': 400,
      '500': 500,
      '600': 600,
      '700': 700,
      '800': 800,
      '900': 900,
    },

    extend: {
      colors: {
        'gray-blue': {
          DEFAULT: colors.blueGray[500],
          ...colors.blueGray,
        },

        'gray-cool': {
          DEFAULT: colors.coolGray[500],
          ...colors.coolGray,
        },

        gray: {
          DEFAULT: colors.gray[500],
          ...colors.gray,
        },

        'gray-true': {
          DEFAULT: colors.trueGray[500],
          ...colors.trueGray,
        },

        'gray-warm': {
          DEFAULT: colors.warmGray[500],
          ...colors.warmGray,
        },

        red: {
          DEFAULT: colors.red[500],
          ...colors.red,
        },

        orange: {
          DEFAULT: colors.orange[500],
          ...colors.orange,
        },

        amber: {
          DEFAULT: colors.amber[500],
          ...colors.amber,
        },

        yellow: {
          DEFAULT: colors.yellow[500],
          ...colors.yellow,
        },

        lime: {
          DEFAULT: colors.lime[500],
          ...colors.lime,
        },

        green: {
          DEFAULT: colors.green[500],
          ...colors.green,
        },

        emerald: {
          DEFAULT: colors.emerald[500],
          ...colors.emerald,
        },

        teal: {
          DEFAULT: colors.teal[500],
          ...colors.teal,
        },

        cyan: {
          DEFAULT: colors.cyan[500],
          ...colors.cyan,
        },

        sky: {
          DEFAULT: colors.sky[500],
          ...colors.sky,
        },

        blue: {
          DEFAULT: colors.blue[500],
          ...colors.blue,
        },

        indigo: {
          DEFAULT: colors.indigo[500],
          ...colors.indigo,
        },

        violet: {
          DEFAULT: colors.violet[500],
          ...colors.violet,
        },

        purple: {
          DEFAULT: colors.purple[500],
          ...colors.purple,
        },

        fuchsia: {
          DEFAULT: colors.fuchsia[500],
          ...colors.fuchsia,
        },

        pink: {
          DEFAULT: colors.pink[500],
          ...colors.pink,
        },

        rose: {
          DEFAULT: colors.rose[500],
          ...colors.rose,
        },
      },

      fontFamily: {
        jost: ['Jost', ...defaultTheme.fontFamily.sans],
        inter: ['Inter', ...defaultTheme.fontFamily.sans],
      },

      spacing: {
        13: '3.25rem',
        15: '3.75rem',
      },

      zIndex: {
        1: '1',
      },

      transitionProperty: {
        width: 'width',
      },

      minHeight: (theme) => ({
        ...theme('spacing'),
        ...theme('height'),
      }),

      minWidth: (theme) => ({
        ...theme('spacing'),
        ...theme('width'),
      }),

      maxHeight: (theme) => ({
        ...theme('spacing'),
        ...theme('height'),
      }),

      maxWidth: (theme) => ({
        ...theme('spacing'),
        ...theme('width'),
      }),
    },
  },

  variants: {
    extend: {
      backgroundColor: ['active'],
      borderColor: ['active'],
      backgroundOpacity: ['active'],
      ringWidth: ['active'],
    },
  },

  purge: {
    enabled: process.env.NODE_ENV === 'production',

    content: [
      './public/**/*.html',
      './src/**/*.{js,jsx}',
    ],

    options: {
      keyframes: true,
      variables: true,
      rejected: true,
    },
  },
};
