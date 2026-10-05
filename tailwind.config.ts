import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#252525",
        rosewood: "#8f3d4f",
        petal: "#f7d9dc",
        ivory: "#fffaf2",
        sage: "#667562",
        gold: "#76512f",
        paper: "#fffdf9",
        sand: "#f4ece4"
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
