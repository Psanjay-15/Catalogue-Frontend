

export const theme = {
  colors: {
    bg: "#fbfaff", 
    surface: "#ffffff", 
    surfaceAlt: "#f4f2fb", 
    ink: "#0c0b14", 
    inkSoft: "#16151f",

    text: "#1a1825",
    textMuted: "#6a6680",
    textFaint: "#9a96ad",
    textInverse: "#f6f5fc",
    textInverseMuted: "rgba(246,245,252,0.66)",

    primary: "#6d5efc",
    primaryDark: "#5546e6",
    primarySoft: "#efecff",
    accent: "#ff7a59",
    accentSoft: "#ffe9e2",

    success: "#15a06a",
    successSoft: "#e2f6ee",
    warning: "#d9870a",
    danger: "#e11d48",
    dangerSoft: "#fde7ec",

    border: "#e8e5f3",
    borderStrong: "#d7d2e8",
  },

  gradients: {
    brand: "linear-gradient(135deg, #6d5efc 0%, #a25dff 48%, #ff7a59 100%)",
    brandSoft: "linear-gradient(135deg, #efecff 0%, #fbe9f6 100%)",
    inkGlow:
      "radial-gradient(120% 120% at 15% 0%, #211b4d 0%, #100e22 45%, #0a0913 100%)",
  },

  radii: {
    sm: "8px",
    md: "12px",
    lg: "18px",
    xl: "26px",
    pill: "999px",
  },

  shadows: {
    xs: "0 1px 2px rgba(16,14,34,0.06)",
    sm: "0 2px 8px rgba(16,14,34,0.08)",
    md: "0 10px 30px rgba(16,14,34,0.10)",
    lg: "0 24px 60px rgba(16,14,34,0.16)",
    glow: "0 18px 50px rgba(109,94,252,0.35)",
  },

  fonts: {
    sans: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
    display: "'Space Grotesk', 'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', ui-monospace, 'SF Mono', monospace",
  },

  // 4px base spacing scale
  space: (n) => `${n * 4}px`,

  layout: {
    maxWidth: "1180px",
    navHeight: "68px",
  },

  transitions: {
    base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "360ms cubic-bezier(0.4, 0, 0.2, 1)",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
  },
};

export default theme;
