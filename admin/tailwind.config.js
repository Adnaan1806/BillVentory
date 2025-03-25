/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: "#CC2B52",
        lightRed: "#AF1740",
        green: "#15B392",
        purple: "#624E88",
      }
    },
  },
  plugins: [],
}