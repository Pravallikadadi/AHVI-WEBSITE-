import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--color-bg) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        muted2: "rgb(var(--color-muted2) / <alpha-value>)",
        gold: "rgb(var(--color-gold) / <alpha-value>)",
        goldsoft: "rgb(var(--color-goldsoft) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        brandFrom: "rgb(var(--brand-from) / <alpha-value>)",
        brandVia: "rgb(var(--brand-via) / <alpha-value>)",
        brandTo: "rgb(var(--brand-to) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["abcNormal", "system-ui", "sans-serif"],
        abcnormal: ["abcNormal", "system-ui", "sans-serif"],
        condensed: ["abcNormal", "system-ui", "sans-serif"],
        serif: ["abcNormal", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: "0.688rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.5rem",
        "2xl": "1.875rem",
        "3xl": "2.25rem",
        "4xl": "3.25rem",
      },
      spacing: {
        "4.5": "1.125rem",
        "5.5": "1.375rem",
        "6.5": "1.625rem",
        "7.5": "1.875rem",
        "8.5": "2.125rem",
        "9.5": "2.375rem",
      },
    },
  },
  plugins: [],
};

export default config;
