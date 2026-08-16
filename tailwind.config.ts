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
        sage: "#71816d",
        gold: "#b9844a"
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgb(55 35 33 / 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
