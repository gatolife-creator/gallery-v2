import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  plugins: [daisyui],
  theme: {
    extend: {},
  },
  purge: ["./index.html", "./src/**/*.{svelte,js,ts}"], // for unused CSS
  variants: {
    extend: {},
  },
  darkMode: "media",
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
};
