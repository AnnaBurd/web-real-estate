/** @type {import('tailwindcss').Config} */

import forms from "@tailwindcss/forms";

import containerQueries from "@tailwindcss/container-queries";

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        signica: ["Signika Negative", "Open Sans", "sans-serif"],
      },
    },
  },
  plugins: [forms, containerQueries],
};
