/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: '#1D1D1F', 2: '#6E6E73', 3: '#86868B' },
        line: '#D2D2D7',
        fill: '#F5F5F7',
        accent: { DEFAULT: '#0071E3', hover: '#0077ED' },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', 'Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.03em',
      },
    },
  },
  plugins: [],
};
