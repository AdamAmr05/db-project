/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505', // Ultra dark
        surface: '#0A0A0A',    // Slightly lighter for cards
        surfaceHighlight: '#151515',
        border: '#333333',     // Lighter border
        primary: '#FFFFFF',
        secondary: '#888888',
        muted: '#888888',      // Lighter muted text
        danger: '#FF3333',
        success: '#33FF33',
        warning: '#FFFF33',
      },
      borderRadius: {
        DEFAULT: '0px',
        sm: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        full: '9999px', // Only for circular avatars if needed
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'dither': "url(\"data:image/svg+xml,%3Csvg width='4' height='4' viewBox='0 0 4 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0H2V2H0V0Z' fill='%23222222' fill-opacity='0.4'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
