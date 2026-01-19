/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'pulse': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      animationDelay: {
        '300': '300ms',
        '700': '700ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.delay-300': {
          'animation-delay': '300ms',
        },
        '.delay-700': {
          'animation-delay': '700ms',
        },
        '.delay-1000': {
          'animation-delay': '1000ms',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
