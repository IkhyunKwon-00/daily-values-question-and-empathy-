import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#EFE9DD",
        "paper-card": "#FBF8F2",
        ink: "#2B2721",
        "ink-soft": "#756D5E",
        line: "#DED4C0",
        clay: "#A85639",
        sage: "#66795E",
      },
      fontFamily: {
        voice: ["var(--font-voice)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(43, 39, 33, 0.06), 0 8px 24px rgba(43, 39, 33, 0.06)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
