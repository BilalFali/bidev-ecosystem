import type { Config } from "tailwindcss";
import { PALETTE } from "./src/lib/palette";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const base = require("@bidev/config/tailwind");

// main-site-only tokens layered on the shared base. Kept local so tech-blog
// and admin keep their own look. Colors come from src/lib/palette.ts, the
// single source that scripts/check-contrast.mjs also reads.
const config: Config = {
  ...base,
  theme: {
    ...base.theme,
    extend: {
      ...base.theme.extend,
      colors: {
        ...base.theme.extend.colors,
        ...PALETTE,
        // Hot-reload amber: state and signal only (new, updated, live).
        signal: {
          DEFAULT: "#f5b400",
          muted: "rgba(245, 180, 0, 0.10)",
        },
      },
      fontFamily: {
        ...base.theme.extend.fontFamily,
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ...base.theme.extend.boxShadow,
        terminal: "0 20px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(66,71,84,0.6)",
      },
      typography: {
        DEFAULT: {
          css: {
            ...base.theme.extend.typography.DEFAULT.css,
            color: PALETTE.ink.muted,
            a: { color: PALETTE.accent.light, "&:hover": { color: PALETTE.accent.DEFAULT } },
            "h1,h2,h3,h4": { color: PALETTE.ink.DEFAULT, fontWeight: "700" },
            code: {
              ...base.theme.extend.typography.DEFAULT.css.code,
              color: PALETTE.accent.light,
              background: PALETTE.accent.muted,
            },
            pre: { background: PALETTE.bg.code, border: `1px solid ${PALETTE.border.DEFAULT}` },
            blockquote: { borderLeftColor: PALETTE.accent.DEFAULT, color: PALETTE.ink.faint },
            hr: { borderColor: PALETTE.border.DEFAULT },
            "ol li::marker": { color: PALETTE.accent.light },
            "ul li::marker": { color: PALETTE.accent.light },
            strong: { color: PALETTE.ink.DEFAULT },
          },
        },
      },
    },
  },
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
