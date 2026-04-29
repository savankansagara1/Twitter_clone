/** @type {import('tailwindcss').Config} */
export default {
  // Tell Tailwind where to look for class names
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Twitter-like dark theme colors
        primary: "#1d9bf0", // Twitter blue
        background: "#000000",
        surface: "#16181c",
        border: "#2f3336",
        textPrimary: "#e7e9ea",
        textSecondary: "#71767b",
      },
    },
  },
  plugins: [],
};
