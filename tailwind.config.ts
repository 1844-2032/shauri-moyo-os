import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        green: { DEFAULT: "#163C2D", deep: "#0E2922", mid: "#3C8463" },
        gold: { DEFAULT: "#C9A227", deep: "#9C7C18" },
        parchment: "#F7F5EF",
        ink: { DEFAULT: "#1B1B18", soft: "#5C5A52" },
        sage: { DEFAULT: "#6F8F6B", deep: "#4C6A48" },
        cloud: "#B9CABE",
        line: "rgba(27,27,24,0.1)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-worksans)", "sans-serif"],
      },
      borderRadius: { card: "12px", lg2: "16px" },
    },
  },
  plugins: [],
};
export default config;
