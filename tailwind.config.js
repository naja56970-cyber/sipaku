/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1F3A',
          800: '#102B4D',
          700: '#163D60',
        },
        green: {
          500: '#1FA66A',
          600: '#158C5D',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(11, 31, 58, 0.08)',
      },
    },
  },
  plugins: [],
};
