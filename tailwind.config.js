/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        wheat: {
          50: '#fdfaf5',
          100: '#f6eed6',
          200: '#ead7a9',
          500: '#d19a3b',
          700: '#ad7225',
          900: '#5c3915',
        },
        andeansky: {
          50: '#f0f7fd',
          100: '#e0effa',
          200: '#bce1f5',
          500: '#419fd9',
          700: '#236ca6',
          900: '#133e66',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-merriweather)', 'serif'],
      }
    },
  },
  plugins: [],
};