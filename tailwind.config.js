/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        shield: {
          bg: '#101513',
          sidebar: '#151C18',
          surface: '#1B231E',
          surface2: '#202A24',
          border: '#303B33',
          text: '#F0F2EC',
          muted: '#9AA59C',
          greenMuted: '#78977E',
          green: '#64B58A',
          amber: '#E5AA52',
          red: '#E36B62',
          blue: '#80A8C8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      }
    },
  },
  plugins: [],
}

