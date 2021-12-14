module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ClashDisplay: ["ClashDisplay-Variable"],
      },
      colors: {
        accent: "#52DEE5",
        background: "#222E50",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
