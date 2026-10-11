import { PALETTE as P } from "../src/lib/palette.ts";

const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(parseInt(hex.slice(i, i + 2), 16)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const pairs = [
  ["ink on bg", P.ink.DEFAULT, P.bg.DEFAULT],
  ["ink on card", P.ink.DEFAULT, P.bg.card],
  ["ink-muted on bg", P.ink.muted, P.bg.DEFAULT],
  ["ink-muted on card", P.ink.muted, P.bg.card],
  ["ink-muted on elevated", P.ink.muted, P.bg.elevated],
  ["ink-faint on bg", P.ink.faint, P.bg.DEFAULT],
  ["ink-faint on card", P.ink.faint, P.bg.card],
  ["ink-faint on elevated", P.ink.faint, P.bg.elevated],
  ["accent on bg", P.accent.DEFAULT, P.bg.DEFAULT],
  ["accent on card", P.accent.DEFAULT, P.bg.card],
  ["accent on elevated", P.accent.DEFAULT, P.bg.elevated],
  ["accent-light on bg", P.accent.light, P.bg.DEFAULT],
  ["accent-light on card", P.accent.light, P.bg.card],
  ["teal on bg", P.teal.DEFAULT, P.bg.DEFAULT],
  ["teal on card", P.teal.DEFAULT, P.bg.card],
  ["tertiary on card", P.tertiary.DEFAULT, P.bg.card],
  ["accent-strong on accent", P.accent.strong, P.accent.DEFAULT],
  ["accent-strong on accent-hover", P.accent.strong, P.accent.hover],
];

let failed = 0;
for (const [name, fg, bg] of pairs) {
  const r = ratio(fg, bg);
  const ok = r >= 4.5;
  if (!ok) failed++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}  ${name}`);
}
if (failed) {
  console.error(`\n${failed} pair(s) below 4.5:1`);
  process.exit(1);
}
