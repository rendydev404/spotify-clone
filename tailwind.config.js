/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/page/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6016ff", // Warna custom kita
      },
    },
  },
  plugins: [],
};