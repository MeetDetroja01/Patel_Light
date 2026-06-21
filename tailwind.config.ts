import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#Fd0304",
          dark: "#cc0000",
          light: "#fef2f2",
        },
        sidebar: {
          bg: "#0f172a",
          text: "#94a3b8",
        },
        body: {
          bg: "#f8fafc",
          color: "#0f172a",
        },
        border: "#e2e8f0",
        success: {
          DEFAULT: "#10b981",
          light: "#ecfdf5",
        },
        warning: {
          DEFAULT: "#f59e0b",
          light: "#fffbeb",
        },
        danger: {
          DEFAULT: "#ef4444",
          light: "#fef2f2",
        },
        info: {
          DEFAULT: "#06b6d4",
          light: "#ecfeff",
        },
        secondary: "#64748b",
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "8px",
        lg: "16px",
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0,0,0,.05), 0 2px 4px -2px rgba(0,0,0,.05)",
        "card-hover": "0 10px 15px -3px rgba(253,3,4,.1), 0 4px 6px -4px rgba(253,3,4,.1)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
