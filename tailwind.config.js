/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#219EBC", // Deep Dive
          light: "#8ECAE6", // Serene Sky
          dark: "#023047", // Midnight Hour
        },
        accent: {
          DEFAULT: "#FFB703", // Golden Ray
          dark: "#FB8500", // Blazing Ember
        },
        gray: {
          DEFAULT: "#B2B2B2", // Neutral Gray
          cool: "#A0A0A0", // Cooler Gray
          dark: "#404040", // Dark Charcoal
          lightest: "#EEEEEE", // Lightest gray color
        },
        cherry: {
          DEFAULT: "#C1121F",
          dark: "#780000",
          light: "#C1525F",
        },
        forrest: {
          DEFAULT: "#104911",
          bright: "#7cb518",
        },
        background: "#eeeeee",
      },
    },
  },
  plugins: [],
};
