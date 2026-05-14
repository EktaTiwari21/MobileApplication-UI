/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./App.tsx"],
  theme: {
    extend: {
      colors: {
        primary: "#570005", // Deep Maroon
        secondary: "#7B1113", // Crimson Accent
        gold: "#C5A059", // Sand Gold
        surface: "#1E1E1E", // Dark Mode Base
        card: "rgba(30, 30, 30, 0.75)", // Glassmorphism Panel Background
      },
      borderRadius: {
        xl: "24px",
      },
      fontFamily: {
        grotesk: ["HankenGrotesk-Regular", "sans-serif"],
        groteskBold: ["HankenGrotesk-Bold", "sans-serif"],
        manrope: ["Manrope-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
