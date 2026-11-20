import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        rosewood: "rgb(var(--color-burgundy) / <alpha-value>)",
        petal: "rgb(var(--color-petal) / <alpha-value>)",
        ivory: "rgb(var(--color-ivory) / <alpha-value>)",
        sage: "rgb(var(--color-sage) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        paper: "rgb(var(--color-paper) / <alpha-value>)",
        sand: "rgb(var(--color-champagne) / <alpha-value>)"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 16px 44px rgb(55 35 33 / 0.09)",
        card: "0 28px 80px rgb(55 35 33 / 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
