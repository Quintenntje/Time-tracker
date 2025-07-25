/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media", // Enable dark mode based on system preference
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
