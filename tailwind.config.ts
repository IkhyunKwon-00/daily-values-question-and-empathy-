import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#111111",
        "paper-card": "#191918",
        "paper-raise": "#252522",
        ink: "#F4F1E8",
        "ink-soft": "#9D9A91",
        line: "#302F2A",
        clay: "#F2C94C",
        "clay-deep": "#D7AE32",
        sage: "#D9C978",
        rose: "#E6A78D",
        amber: "#F2C94C",
        indigo: "#9D9A91",
      },
      fontFamily: {
        voice: ["var(--font-body)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-body)", "sans-serif"],
        logo: ["var(--font-logo)", "cursive"],
      },
      backgroundImage: {
        ember:
          "linear-gradient(135deg,#F6D967 0%,#F2C94C 58%,#D7AE32 100%)",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.4)",
        card: "0 1px 2px rgba(0,0,0,0.4), 0 12px 30px rgba(0,0,0,0.5)",
        pop: "0 8px 24px rgba(245,197,24,0.28)",
      },
      borderRadius: {
        xl2: "0.5rem",
        xl3: "0.5rem",
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
