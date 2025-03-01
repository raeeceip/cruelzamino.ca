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
        poster: ['Playfair Display', 'serif'],
      },
      fontSize: {
        'display': ['clamp(2.5rem, 8vw, 4.5rem)', { lineHeight: '1.1' }],
        'title': ['clamp(2rem, 5vw, 3rem)', { lineHeight: '1.2' }],
        'poster': ['clamp(3rem, 10vw, 5rem)', { lineHeight: '1.05' }],
      },
      spacing: {
        'header': '5rem',
      },
      screens: {
        'xs': '475px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      transitionProperty: {
        'transform': 'transform',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(4px)',
      },
      textShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.5)',
        'md': '0 2px 4px rgba(0, 0, 0, 0.5)',
        'lg': '0 8px 16px rgba(0, 0, 0, 0.5)',
        'poster': '2px 2px 0px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-sm': {
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-md': {
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-lg': {
          textShadow: '0 8px 16px rgba(0, 0, 0, 0.5)',
        },
        '.text-shadow-poster': {
          textShadow: '2px 2px 0px rgba(0, 0, 0, 0.8)',
        },
        '.poster-filter': {
          filter: 'contrast(1.1) saturate(1.2) brightness(1.1)',
        },
        '.vintage-texture': {
          position: 'relative',
        },
        '.vintage-texture::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          opacity: '0.05',
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }
      }
      addUtilities(newUtilities)
    }
  ],
}