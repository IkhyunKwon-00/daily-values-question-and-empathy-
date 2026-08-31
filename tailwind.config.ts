import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#000000",
        "paper-card": "#1C1C1E",
        "paper-raise": "#2C2C2E",
        ink: "#FFFFFF",
        "ink-soft": "#8E8E93",
        line: "#2C2C2E",
        clay: "#F5C518",
        "clay-deep": "#D9A800",
        sage: "#E9C84B",
        rose: "#F5C518",
        amber: "#F5C518",
        indigo: "#8E8E93",
      },
      fontFamily: {
        voice: ["var(--font-body)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-body)", "sans-serif"],
        logo: ["var(--font-logo)", "cursive"],
      },
      backgroundImage: {
        ember:
          "linear-gradient(135deg,#FFE066 0%,#F5C518 52%,#E0A800 100%)",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.4)",
        card: "0 1px 2px rgba(0,0,0,0.4), 0 12px 30px rgba(0,0,0,0.5)",
        pop: "0 8px 24px rgba(245,197,24,0.28)",
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
