/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-purple': '#4d2c6e',
        'reddish-purple': '#7c2d51',
      },
    },
  },
  plugins: [],
}

