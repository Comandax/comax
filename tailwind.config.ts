import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        primary: "#4C59F2",
        onPrimary: "#FFFFFF",
        primaryContainer: "#DEE0FF",
        onPrimaryContainer: "#000563",
        primaryFixed: "#DEE0FF",
        onPrimaryFixed: "#000563",
        primaryFixedVariant: "#BEC2FF",
        onPrimaryFixedVariant: "#000563",

        secondary: "#545F70",
        onSecondary: "#FFFFFF",
        secondaryContainer: "#D8E3F7",
        onSecondaryContainer: "#131B24",
        secondaryFixed: "#D8E3F7",
        onSecondaryFixed: "#131B24",
        secondaryFixedVariant: "#B9C7E8",
        onSecondaryFixedVariant: "#131B24",

        tertiary: "#715B71",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#FBD7FB",
        onTertiaryContainer: "#281527",
        tertiaryFixed: "#FBD7FB",
        onTertiaryFixed: "#281527",
        tertiaryFixedVariant: "#F2BDEE",
        onTertiaryFixedVariant: "#281527",

        error: "#BA1A1A",
        onError: "#FFFFFF",
        errorContainer: "#FFDAD6",
        onErrorContainer: "#410002",

        background: "#FEFBFF",
        surface: "#FEFBFF",
        surfaceDim: "#F6F2FA",
        surfaceBright: "#FEFBFF",
        inverseSurface: "#313033",
        inverseOnSurface: "#F4EFF4",
        onSurface: "#1B1B1E",
        onSurfaceVariant: "#46464F",

        outline: "#777680",
        outlineVariant: "#C9C5D0",
        scrim: "#000000",
        shadow: "#000000",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float-in": {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float-in": "float-in 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
