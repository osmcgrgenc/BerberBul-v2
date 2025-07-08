import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#171717",
        primary: {
          DEFAULT: "#6366f1",
          dark: "#4f46e5",
          light: "#a5b4fc",
        },
        secondary: {
          DEFAULT: "#f59e42", // örnek turuncu
          dark: "#b45309",
        },
        accent: {
          DEFAULT: "#f43f5e", // örnek pembe
          dark: "#be123c",
        },
        gray: {
          50: "#f9fafb",
          100: "#f3f4f6",
          200: "#e5e7eb",
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          600: "#4b5563",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
        roboto: ["var(--font-roboto)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
      },
    },
  },
  plugins: [],
};

export default config;
