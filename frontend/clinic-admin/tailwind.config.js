/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          orange: '#E8630A',
          dark: '#1A1D2E',
          darker: '#13151F',
          card: '#1E2132',
          border: '#2A2E45',
          muted: '#6B7280',
        },
      },
    },
  },
  plugins: [],
};
