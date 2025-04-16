/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        green: {
          50: '#f0fdf4',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
        },
        red: {
          50: '#fef2f2',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
        },
        blue: {
          50: '#eff6ff',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
        },
      },
    }
  },
  plugins: [],
}
