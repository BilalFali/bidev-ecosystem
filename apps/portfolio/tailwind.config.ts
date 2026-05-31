import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const base = require("@bidev/config/tailwind");

const config: Config = {
  ...base,
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    ...base.theme,
    extend: {
      ...base.theme.extend,
      colors: {
        ...base.theme.extend.colors,
        // Portfolio accent: indigo/violet instead of cyan
        accent: {
          DEFAULT: "#818cf8",
          hover: "#6366f1",
          muted: "rgba(129,140,248,0.08)",
          strong: "#4f46e5",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
