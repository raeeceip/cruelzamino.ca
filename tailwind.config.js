/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand': {
          pink: '#FF1493',
          yellow: '#FDDA0D',
        },
        'base': {
          black: '#000000',
          white: '#FFFFFF',
        },
        'accent': {
          purple: '#6B46C1',
          teal: '#38B2AC',
        }
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 8vw, 4.5rem)', { lineHeight: '1.1' }],
        'title': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.2' }],
      },
      spacing: {
        'header': '5rem',
      },
      screens: {
        'xs': '475px',
      },
    },
  },
  plugins: [],
}