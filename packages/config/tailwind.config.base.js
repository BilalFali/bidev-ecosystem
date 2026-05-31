/** @type {import('tailwindcss').Config} */
const tailwindBase = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#050505",
          secondary: "#0e0e0e",
          card: "#141414",
          elevated: "#1e1e1e",
        },
        border: {
          DEFAULT: "#242424",
          subtle: "#1a1a1a",
          strong: "#3a3a3a",
        },
        accent: {
          DEFAULT: "#22d3ee",
          hover: "#06b6d4",
          muted: "rgba(34,211,238,0.08)",
          strong: "#0891b2",
        },
        ink: {
          DEFAULT: "#f0f0f0",
          muted: "#71717a",
          faint: "#3f3f46",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.5s ease forwards",
        "slide-down": "slideDown 0.3s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: "translateY(12px)" }, to: { opacity: 1, transform: "translateY(0)" } },
        slideDown: { from: { opacity: 0, transform: "translateY(-8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#d4d4d8",
            maxWidth: "none",
            a: { color: "#22d3ee", "&:hover": { color: "#06b6d4" } },
            "h1,h2,h3,h4": { color: "#f0f0f0", fontWeight: "700" },
            code: {
              color: "#22d3ee",
              background: "rgba(34,211,238,0.08)",
              borderRadius: "4px",
              padding: "2px 6px",
              fontWeight: "400",
              "&::before": { content: '""' },
              "&::after": { content: '""' },
            },
            pre: { background: "#111", border: "1px solid #242424" },
            blockquote: { borderLeftColor: "#22d3ee", color: "#a1a1aa" },
            hr: { borderColor: "#242424" },
            "ol li::marker": { color: "#22d3ee" },
            "ul li::marker": { color: "#22d3ee" },
            strong: { color: "#f0f0f0" },
          },
        },
      },
    },
  },
};

module.exports = tailwindBase;
