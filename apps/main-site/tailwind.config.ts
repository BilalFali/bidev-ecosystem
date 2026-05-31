import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const base = require("@bidev/config/tailwind");

const config: Config = {
  ...base,
  content: [
    "./src/**/*.{ts,tsx,mdx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
