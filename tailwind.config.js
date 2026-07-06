/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0D0D1A",
        surface: "#13132A",
        surfaceHi: "#1A1A38",
        border: "#2A2A50",
        borderLo: "#1E1E3C",
        lavender: "#A78BFA",
        lavSoft: "#C4B5FD",
        lavDim: "#6D5CB8",
        pink: "#E879A0",
        pinkSoft: "#F5A7C7",
        cyan: "#67E8F9",
        green: "#6EE7B7",
        amber: "#FCD34D",
        red: "#F87171",
        textHi: "#F0EEF8",
        textMid: "#A8A4C8",
        textLo: "#5C5880",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
      },
    },
  },
  plugins: [],
};
