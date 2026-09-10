import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const base = require("@bidev/config/tailwind");

// main-site-only additions layered on top of the shared dark/Flutter-blue base.
// Kept local (not in packages/config) because this "hot reload" signal color
// and terminal-glow shadow are specific to this app's editorial treatment,
// not something tech-blog or admin should inherit.
const config: Config = {
  ...base,
  theme: {
    ...base.theme,
    extend: {
      ...base.theme.extend,
      colors: {
        ...base.theme.extend.colors,
        // Hot-reload amber — the actual color Flutter DevTools/IDE tooling
        // uses for its hot-reload lightning bolt. Reserved for state/signal
        // (new, updated, live, difficulty) — never for links or primary actions,
        // which stay on the Flutter-blue accent.
        signal: {
          DEFAULT: "#f5b400",
          muted: "rgba(245, 180, 0, 0.10)",
        },
      },
      fontFamily: {
        ...base.theme.extend.fontFamily,
        // Space Grotesk replaces the shared base's Geist mapping for this
        // app only — Geist reads as the single most common "modern tech
        // site" default in current AI-generated design; Space Grotesk's
        // geometric, slightly technical letterforms fit this site's
        // existing CLI/terminal identity instead.
        sans: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        ...base.theme.extend.boxShadow,
        terminal: "0 20px 60px -20px rgba(0,0,0,0.6), 0 0 0 1px rgba(64,71,81,0.6)",
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
