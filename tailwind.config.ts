import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#111110",
        "paper-card": "#191918",
        "paper-raise": "#24231F",
        ink: "#F3F0E7",
        "ink-soft": "#A29F96",
        line: "#34322C",
        clay: "#E8BD4A",
        "clay-deep": "#D5A936",
        sage: "#C8C09A",
        rose: "#D99A86",
        amber: "#E8BD4A",
        indigo: "#A29F96",
      },
      fontFamily: {
        voice: ["var(--font-voice)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-body)", "sans-serif"],
        logo: ["var(--font-logo)", "cursive"],
      },
      backgroundImage: {
        ember:
          "linear-gradient(135deg,#F6D967 0%,#F2C94C 58%,#D7AE32 100%)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(0,0,0,0.24)",
        card: "0 10px 28px rgba(0,0,0,0.28)",
        pop: "0 4px 14px rgba(232,189,74,0.18)",
      },
      borderRadius: {
        xl2: "0.5rem",
        xl3: "0.5rem",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 180ms ease-out",
        "fade-up": "fade-up 180ms ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
