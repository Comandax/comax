
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
        // Cores principais
        primary: "#555A92",
        onPrimary: "#FFFFFF",
        primaryContainer: "#E0E0FF",
        onPrimaryContainer: "#3D4279",

        secondary: "#5C5D72",
        onSecondary: "#FFFFFF",
        secondaryContainer: "#E1E0F9",
        onSecondaryContainer: "#444559",

        tertiary: "#78536B",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#FFD8EE",
        onTertiaryContainer: "#5E3C53",

        error: "#BA1A1A",
        onError: "#FFFFFF",
        errorContainer: "#FFDAD6",
        onErrorContainer: "#93000A",

        // Superfícies e fundos
        background: "#FFFFFF",
        onBackground: "#1B1B21",
        surface: "#FBF8FF",
        onSurface: "#1B1B21",
        surfaceVariant: "#E3E1EC",
        onSurfaceVariant: "#46464F",
        
        // Outlines e sombras
        outline: "#777680",
        outlineVariant: "#C7C5D0",
        shadow: "#000000",
        scrim: "#000000",

        // Cores inversas
        inverseSurface: "#303036",
        inverseOnSurface: "#F2EFF7",
        inversePrimary: "#BEC2FF",

        // Tokens fixed do MD3
        primaryFixed: "#E0E0FF",
        onPrimaryFixed: "#10144B",
        primaryFixedDim: "#BEC2FF",
        onPrimaryFixedVariant: "#3D4279",

        secondaryFixed: "#E1E0F9",
        onSecondaryFixed: "#191A2C",
        secondaryFixedDim: "#C5C4DD",
        onSecondaryFixedVariant: "#444559",

        tertiaryFixed: "#FFD8EE",
        onTertiaryFixed: "#2E1126",
        tertiaryFixedDim: "#E7B9D5",
        onTertiaryFixedVariant: "#5E3C53",

        // Superfícies adicionais
        surfaceDim: "#DBD9E0",
        surfaceBright: "#FBF8FF",
        surfaceContainerLowest: "#FFFFFF",
        surfaceContainerLow: "#F5F2FA",
        surfaceContainer: "#F0ECF4",
        surfaceContainerHigh: "#EAE7EF",
        surfaceContainerHighest: "#E4E1E9",

        // Variantes extras para garantir consistência com shadcn/ui
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",

        popover: "#FBF8FF",
        "popover-foreground": "#1B1B21",
        card: "#FBF8FF",
        "card-foreground": "#1B1B21",
        muted: "#FBF8FF",
        "muted-foreground": "#1B1B21",
        accent: "#FBF8FF",
        "accent-foreground": "#1B1B21",
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
