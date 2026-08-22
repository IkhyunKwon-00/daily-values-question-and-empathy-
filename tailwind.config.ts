import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#F5F0E8",
        "paper-card": "#FFFDF9",
        ink: "#241F1A",
        "ink-soft": "#8A8073",
        line: "#ECE4D6",
        clay: "#F0623C",
        "clay-deep": "#D8452A",
        sage: "#5E8A6E",
        rose: "#E8506E",
        amber: "#D98A2B",
        indigo: "#6C7BB8",
      },
      fontFamily: {
        voice: ["var(--font-voice)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        ember:
          "linear-gradient(135deg,#FF8A4C 0%,#F0623C 48%,#E8506E 100%)",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(36,31,26,0.06)",
        card: "0 2px 8px rgba(36,31,26,0.05), 0 14px 34px rgba(36,31,26,0.08)",
        pop: "0 10px 30px rgba(240,98,60,0.30)",
      },
      borderRadius: {
        xl2: "1.5rem",
        xl3: "2rem",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.28)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 260ms ease-out",
        "fade-up": "fade-up 220ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
