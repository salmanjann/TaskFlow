/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // 171738
  theme: {
    extend: {
      colors : {
        customBg:{
          _black:'#0c090d',
          _red: '#ff0000',
          _blue: '#580aff',
          _green : '#a1ff0a',
        }
      }
    },
  },
  plugins: [],
}