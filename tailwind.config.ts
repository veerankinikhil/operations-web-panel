import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        telegram: {
          50: "#eaf5fb",
          100: "#d5ebf7",
          200: "#abd8ef",
          300: "#80c4e7",
          400: "#56b0df",
          500: "#229ed9",
          600: "#1a84b8",
          700: "#146892",
          800: "#0e4d6c",
          900: "#093146",
        },
      },
    },
  },
  plugins: [],
};
export default config;
