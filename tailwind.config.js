module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {},
  },
  daisyui: {
    darkTheme: 'coffee',
    themes: [
      'bumblebee',
      {
        coffee: {
          ...require("daisyui/src/colors/themes")["[data-theme=coffee]"],
          'base-content': 'rgb(255, 242, 229)',
          'base-100': 'rgb(33, 23, 32)',
          'base-200': 'rgb(53, 38, 39)',
        }
      }
    ]
  },
  plugins: [require("daisyui")],
};
