/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "base-dark": "#1E2124",
        "input-dark": "#282C30",
        "button-dark": "#3A3F44",
        "button-hover": "#444A50",
      },
    },
  },
  plugins: [],
};
