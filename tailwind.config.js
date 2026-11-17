/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 20px 60px rgba(24, 24, 27, 0.12)',
      },
      colors: {
        velora: {
          50: '#f7f3ef',
          100: '#efe4db',
          500: '#9A3412',
          600: '#7c2d12',
          700: '#5d2a16',
        },
      },
    },
  },
  plugins: [],
}

