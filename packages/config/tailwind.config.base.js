/** @type {import('tailwindcss').Config} */
const tailwindBase = {
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        // ── Surfaces (deep-night tonal stack) ───────────────────────────────
        bg: {
          DEFAULT:  "#101418",   // surface / background
          secondary:"#0b0e13",   // surface-container-lowest
          card:     "#1c2025",   // surface-container
          elevated: "#272a2f",   // surface-container-high
          elevated2:"#31353a",   // surface-container-highest
        },
        // ── Borders ──────────────────────────────────────────────────────────
        border: {
          DEFAULT: "#404751",    // outline-variant
          subtle:  "#31353a",    // surface-variant
          strong:  "#8a919c",    // outline
        },
        // ── Primary / accent (Flutter blue) ──────────────────────────────────
        accent: {
          DEFAULT: "#0175c2",                   // primary-container — buttons, links
          light:   "#9ecaff",                   // primary — text highlights, glows
          hover:   "#0061a3",                   // inverse-primary
          muted:   "rgba(1, 117, 194, 0.10)",   // faint tint for bg fills
          strong:  "#003258",                   // on-primary (deep)
        },
        // ── Text ────────────────────────────────────────────────────────────
        ink: {
          DEFAULT: "#e0e2e9",    // on-surface
          muted:   "#c0c7d3",    // on-surface-variant
          faint:   "#8a919c",    // outline — for metadata, placeholders
        },
        // ── Semantic states (desaturated for premium feel) ──────────────────
        success: { DEFAULT: "#4ade80", muted: "rgba(74,222,128,0.10)" },
        warning: { DEFAULT: "#fb923c", muted: "rgba(251,146,60,0.10)" },
        danger:  { DEFAULT: "#f87171", muted: "rgba(248,113,113,0.10)" },
      },
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)",  "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      animation: {
        "fade-in":    "fadeIn 0.4s ease forwards",
        "slide-up":   "slideUp 0.5s ease forwards",
        "slide-down": "slideDown 0.3s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                                     to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: "translateY(12px)" },      to: { opacity: 1, transform: "translateY(0)" } },
        slideDown: { from: { opacity: 0, transform: "translateY(-8px)" },      to: { opacity: 1, transform: "translateY(0)" } },
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#c0c7d3",
            maxWidth: "none",
            a: { color: "#9ecaff", "&:hover": { color: "#0175c2" } },
            "h1,h2,h3,h4": { color: "#e0e2e9", fontWeight: "700" },
            code: {
              color: "#9ecaff",
              background: "rgba(1,117,194,0.10)",
              borderRadius: "4px",
              padding: "2px 6px",
              fontWeight: "400",
              "&::before": { content: '""' },
              "&::after":  { content: '""' },
            },
            pre: { background: "#181c21", border: "1px solid #404751" },
            blockquote: { borderLeftColor: "#0175c2", color: "#8a919c" },
            hr: { borderColor: "#404751" },
            "ol li::marker": { color: "#9ecaff" },
            "ul li::marker": { color: "#9ecaff" },
            strong: { color: "#e0e2e9" },
          },
        },
      },
    },
  },
};

module.exports = tailwindBase;
