import type { Config } from "tailwindcss";

// NOTE: We intentionally do NOT spread @bidev/config's base theme.extend here.
// That base defines "ink"/"accent"/"border" for main-site's dark, Flutter-blue,
// rounded-corner dev-tool aesthetic — tech-blog reuses the same token NAMES
// (so @bidev/ui's Container/AdSlot/SectionHeader/Spinner keep working) but with
// entirely different, editorial-magazine VALUES per .claude/skills/tech-blog-design.

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          // Cooler, greyer-green undertone — drafting-paper, not bakery-cream.
          // The near-#FAF8F4 warm cream + high-contrast serif combo is one of
          // the most recognizable "AI-generated editorial" tells; #F0F1EB reads
          // as considered stock rather than a template default.
          DEFAULT: "#F0F1EB",
          raised:  "#FFFFFF",
          sunken:  "#E7E8DF",
        },
        // "bg" alias kept so any shared component expecting bg-bg-* still resolves sanely
        bg: {
          DEFAULT:  "#F0F1EB",
          card:     "#FFFFFF",
          elevated: "#E7E8DF",
        },
        ink: {
          DEFAULT: "#17140F",
          muted:   "#4A453C",
          faint:   "#8A8375",
        },
        border: {
          DEFAULT: "#E4DFD3",
          strong:  "#CFC8B6",
        },
        accent: {
          DEFAULT: "#D4380D",
          hover:   "#B32E09",
          tint:    "#FBE7DF",
        },
        data: {
          DEFAULT: "#0F6E5C",
          tint:    "#E1F0EC",
        },
        // Per-category color — this is the actual category identity everywhere
        // an eyebrow/label is shown, replacing a single monotone accent used
        // for every category alike. Reused hexes for categories that carry
        // over from the old 7-color set; added mobile/data/software for the
        // taxonomy's full 10 categories (see TAXONOMY.md §2).
        cat: {
          ai:                   "#6B4FA0", // violet
          mobile:                "#B8456B", // rose
          hardware:             "#55606B", // slate
          software:             "#8C6D1F", // olive-gold
          bigtech:              "#2E5A8C", // blue
          data:                 "#0F6E5C", // teal — matches the --data chart token
          security:             "#B0231C", // dark red
          business:             "#A05A2C", // brown (carried over from "startups")
          gaming:               "#2F7D4F", // green
          "future-tech-science": "#3F7C82", // teal-blue (carried over from "science")
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans:    ["var(--font-plex-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono:    ["var(--font-plex-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      borderRadius: {
        none: "0px",
        sm:   "2px",
        DEFAULT: "2px",
        md:   "4px",
        full: "9999px",
      },
      boxShadow: {
        card:     "0 1px 2px rgba(23,20,15,0.04)",
        elevated: "0 4px 16px rgba(23,20,15,0.08)",
      },
      maxWidth: {
        measure: "68ch",
      },
      animation: {
        "fade-up": "fadeUp 0.4s ease forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body":      "#4A453C",
            "--tw-prose-headings":  "#17140F",
            "--tw-prose-links":     "#D4380D",
            "--tw-prose-bold":      "#17140F",
            "--tw-prose-quotes":    "#17140F",
            "--tw-prose-quote-borders": "#D4380D",
            "--tw-prose-hr":        "#E4DFD3",
            "--tw-prose-code":      "#17140F",
            "--tw-prose-pre-bg":    "#F1EEE7",
            "--tw-prose-pre-code":  "#17140F",
            maxWidth: "68ch",
            fontFamily: "var(--font-plex-sans)",
            fontSize: "1.0625rem",
            lineHeight: "1.7",
            "h1, h2, h3, h4": { fontFamily: "var(--font-display)", fontWeight: "560" },
            code: {
              fontFamily: "var(--font-plex-mono)",
              background: "#F1EEE7",
              borderRadius: "2px",
              padding: "2px 6px",
              fontWeight: "400",
              "&::before": { content: '""' },
              "&::after":  { content: '""' },
            },
            pre: { borderRadius: "2px", border: "1px solid #E4DFD3" },
            blockquote: {
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontWeight: "400",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
