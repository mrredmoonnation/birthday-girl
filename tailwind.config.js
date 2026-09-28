/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        void: "#05050f",
        dusk: "#0c0c1e",
        glow: {
          rose: "#ffb8d1",
          gold: "#ffe1a8",
          sky: "#b8d4ff",
        },
      },
      fontFamily: {
        display: ["'Cormorant Garamond'", "serif"],
        hand: ["'Caveat'", "cursive"],
        body: ["'Manrope'", "sans-serif"],
      },
      boxShadow: {
        starGlow: "0 0 24px 6px rgba(255, 220, 180, 0.35)",
        panelGlow: "0 0 80px 20px rgba(200, 170, 255, 0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
