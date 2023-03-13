/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        move: "move 2s linear infinite",
      },
      keyframes: {
        move: {
          "0%": {
            "background-image": "linear-gradient(to right, #4338ca,#a21caf)",
          },
          "50%": {
            "background-image": "linear-gradient(to right, #a21caf,#4338ca)",
          },
        },
      },
    },
    screens: {
      xs: "36em",
      sm: "48em",
      md: "62em",
      lg: "75em",
      xl: "88em",
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false,
  },
};
