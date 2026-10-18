# Stitch Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the Stitch mockup (`newcodeui.jsx`) to bidev.dev main-site: new color and font tokens, redesigned Header and Footer, a new homepage hero and sections, and a redesigned article page, using only real site data.

**Architecture:** One palette module (`src/lib/palette.ts`) feeds `tailwind.config.ts`, so existing semantic classes (`bg-card`, `ink`, `accent`) re-theme every page. Small pure helpers (heading ids, adjacent articles, tag-to-tool, top tags) live in `src/lib/` and are checked with `node --test`. New UI is small server components under `src/components/`.

**Tech Stack:** Next.js 15.3.9 App Router, React 19, Tailwind 3.4, `next/font` (Inter, JetBrains Mono), Supabase data via existing `src/lib/*`, Node 24 (`node --test` runs `.ts` helpers directly).

**Spec:** `docs/superpowers/specs/2026-10-05-stitch-redesign-design.md`

## Global Constraints

- Touch only `apps/main-site` (plus these docs). Do not edit `packages/*`, `apps/tech-blog`, `apps/admin`, `apps/portfolio`.
- No new npm dependencies. No Tailwind CDN. No literal HTML port of `newcodeui.jsx`.
- No fabricated content. Must never ship: "4,200+", "Staff Mobile Architect", "Verified on Google Play", "Flutter 3.29", "48 articles", "0ms", "LATENCY", "REGION", "ALL SYSTEMS OPERATIONAL", "System Status", "SaaS Mobile Starter Kit", "Clean Architecture Template", "every Tuesday", a Bookmark button, a subscriber count.
- Fonts: Inter (text), JetBrains Mono (code, badges, labels). Remove Space Grotesk from main-site.
- Contrast: every text and fill pair in `scripts/check-contrast.mjs` must be at least 4.5:1.
- Ad gating (`NEXT_PUBLIC_ADS_ENABLED`) and AdSlot placements are not changed, except the article sidebar slot moves into the new sidebar.
- New copy uses no em dashes and no stock AI phrases.
- Do not run `git commit` or `git push` unless the owner has asked; the "Commit" steps apply only then.
- Build note: on this Windows machine `npm run build --workspace=apps/main-site` can fail at the last standalone copy with `EBUSY` after "Compiled successfully". Stop any running `node` or `next` process first. If it still fails after a successful compile, verify from `.next/server/app` and say so.

## Review Focus

- A database article with fewer than 3 headings must show no table of contents and no empty box (guard in the Task 2 TableOfContents component, checked on the built page in Task 5).
- Headings that are duplicated, contain inline markup or entities, already have an id, are empty, or are non-ASCII must yield unique, valid ids (Task 2 tests).
- A tag named like an object property ("constructor", "toString") must not match a tool or crash the banner lookup (Task 5 test).
- The first, last, and only article in a category must render prev/next cleanly with the missing side omitted (Task 5 test).
- Zero tags or zero published products on the homepage must omit those sections, not render empty ones (Task 4 test for `topTags`, `length > 0` guards).

## File Structure

| File | Responsibility |
| --- | --- |
| `src/lib/palette.ts` (new) | Single source of truth for color tokens |
| `scripts/check-contrast.mjs` (new) | Asserts WCAG AA for palette pairs |
| `tailwind.config.ts` | Consumes `PALETTE`, Inter font, typography colors |
| `src/lib/toc.ts` (new) | `addHeadingIds(html)`, `extractMarkdownHeadings(md)` |
| `src/lib/adjacent.ts` (new) | `pickAdjacent(all, slug)` |
| `src/lib/article-tools.ts` (new) | `toolSlugForTags(tags)` |
| `src/lib/topics.ts` (new) | `topTags(articles, limit)` |
| `src/lib/site-links.ts` (new) | Social and portfolio URLs shared by Footer and AuthorBox |
| `tests/*.test.mjs` (new) | `node --test` checks for the helpers |
| `src/components/layout/LogoMark.tsx` (new), `Header.tsx`, `Footer.tsx` | Shared chrome |
| `src/components/home/*` (new) | `SectionHeading`, `JsonToDartPreview`, `TrustStrip` |
| `src/components/blog/*` (new/changed) | `ArticleHero`, `ArticleSidebar`, `AuthorBox`, `RelatedToolBanner`, `PrevNextArticles`, `TableOfContents` |
| `src/app/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css` | Pages and global styles |
| `scripts/check-built-claims.mjs` (new) | Greps built HTML for forbidden claims and required markers |

---

### Task 1: Design tokens, Inter, contrast check

**Files:**
- Create: `apps/main-site/src/lib/palette.ts`
- Create: `apps/main-site/scripts/check-contrast.mjs`
- Modify: `apps/main-site/tailwind.config.ts`, `apps/main-site/src/app/layout.tsx`, `apps/main-site/src/app/globals.css`, `apps/main-site/src/components/ui/Button.tsx:28`, `apps/main-site/src/app/troubleshooting/page.tsx:58`

**Interfaces:**
- Produces: `PALETTE` (readonly object with groups `bg`, `border`, `accent`, `ink`, `teal`, `tertiary`) imported by `tailwind.config.ts` and `scripts/check-contrast.mjs`. Tailwind classes `text-teal`, `bg-teal-muted`, `text-tertiary`, `text-accent-strong`, `bg-bg-code` become available. CSS variable `--font-inter`.

- [ ] **Step 1: Write the failing contrast check**

Create `apps/main-site/scripts/check-contrast.mjs`:

```js
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
```

- [ ] **Step 2: Run it to verify it fails**

Run (from `apps/main-site`): `node scripts/check-contrast.mjs`
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `../src/lib/palette.ts`.

- [ ] **Step 3: Create the palette**

Create `apps/main-site/src/lib/palette.ts`:

```ts
export const PALETTE = {
  bg: {
    DEFAULT: "#0f131d",
    secondary: "#0a0e18",
    card: "#1c1f2a",
    elevated: "#262a35",
    elevated2: "#313540",
    code: "#0e1422",
  },
  border: {
    DEFAULT: "#424754",
    subtle: "#313540",
    strong: "#8c909f",
  },
  accent: {
    DEFAULT: "#4d8eff",
    light: "#adc6ff",
    hover: "#6ba0ff",
    muted: "rgba(77, 142, 255, 0.10)",
    strong: "#001a42",
  },
  ink: {
    DEFAULT: "#dfe2f1",
    muted: "#c2c6d6",
    faint: "#8c909f",
  },
  teal: {
    DEFAULT: "#4fdbc8",
    muted: "rgba(79, 219, 200, 0.10)",
  },
  tertiary: {
    DEFAULT: "#ffb786",
    muted: "rgba(255, 183, 134, 0.10)",
  },
} as const;
```

- [ ] **Step 4: Run the contrast check to verify it passes**

Run: `node scripts/check-contrast.mjs`
Expected: every line `PASS`, exit code 0. If `ink-faint on elevated` or `accent on elevated` prints `FAIL` (they sit near 4.5), raise that single token one step lighter in `palette.ts` and re-run.

- [ ] **Step 5: Wire the palette into Tailwind**

Replace `apps/main-site/tailwind.config.ts` with:

```ts
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
```

- [ ] **Step 6: Switch the font to Inter and the theme color**

In `apps/main-site/src/app/layout.tsx` make these four edits:

1. `import { Space_Grotesk, JetBrains_Mono } from "next/font/google";` becomes `import { Inter, JetBrains_Mono } from "next/font/google";`
2. Replace the whole block from the comment `// Space Grotesk replaces Geist` through the closing `});` of `const spaceGrotesk = Space_Grotesk({ ... });` with:

```tsx
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "optional",  // no layout shift: falls back to the system font if not cached
  preload: true,
});
```

3. `className={`${spaceGrotesk.variable} ${mono.variable}`}` becomes `className={`${inter.variable} ${mono.variable}`}`
4. In `viewport`, `themeColor: "#101418"` becomes `themeColor: "#0f131d"`

- [ ] **Step 7: Update hard-coded colors in globals.css, Button, troubleshooting page**

Create a throwaway script `apps/main-site/scripts/_retheme.mjs`:

```js
import { readFileSync, writeFileSync } from "node:fs";

const file = new URL("../src/app/globals.css", import.meta.url);
let css = readFileSync(file, "utf8");
const pairs = [
  ["#101418", "#0f131d"],
  ["#0b0e13", "#0a0e18"],
  ["#404751", "#424754"],
  ["#8a919c", "#8c909f"],
  ["#e0e2e9", "#dfe2f1"],
  ["#9ecaff", "#adc6ff"],
  ["#0175c2", "#4d8eff"],
  ["#2a323c", "#2a3040"],
  ["#0e1217", "#0c1019"],
  ["rgba(16, 20, 24, 0.85)", "rgba(15, 19, 29, 0.85)"],
  ["rgba(64, 71, 81, 0.4)", "rgba(66, 71, 84, 0.4)"],
  ["rgba(1, 117, 194,", "rgba(77, 142, 255,"],
  ["rgba(1,117,194,", "rgba(77,142,255,"],
  ["var(--font-space-grotesk)", "var(--font-inter)"],
];
for (const [from, to] of pairs) {
  if (!css.includes(from)) throw new Error(`not found in globals.css: ${from}`);
  css = css.split(from).join(to);
}
writeFileSync(file, css);
console.log("globals.css updated");
```

Run: `node scripts/_retheme.mjs` then delete it: `rm scripts/_retheme.mjs`.
Expected: `globals.css updated`.

In `apps/main-site/src/components/ui/Button.tsx` line 28, change `bg-accent text-white` to `bg-accent text-accent-strong` and `rgba(1,117,194,0.55)` to `rgba(77,142,255,0.45)`. The `hover:bg-accent-hover` on the next line stays.

In `apps/main-site/src/app/troubleshooting/page.tsx` line 58, change `bg-[#0b0e13]` to `bg-bg-secondary`.

- [ ] **Step 8: Verify**

Run from repo root:
- `npx tsc --noEmit -p apps/main-site/tsconfig.json` (expected: no output)
- `grep -rnE "#(101418|0b0e13|1c2025|272a2f|31353a|404751|8a919c|0175c2|9ecaff|e0e2e9|c0c7d3)|space-grotesk" apps/main-site/src` (expected: no matches)
- `npm run build --workspace=apps/main-site` (expected: "Compiled successfully")
- `grep -rl "4d8eff" apps/main-site/.next/static/css | head -1` prints a file; `grep -rl "0175c2" apps/main-site/.next/static/css` prints nothing.

- [ ] **Step 9: Commit (only if the owner asked for commits)**

```bash
git add apps/main-site/src/lib/palette.ts apps/main-site/scripts/check-contrast.mjs apps/main-site/tailwind.config.ts apps/main-site/src/app/layout.tsx apps/main-site/src/app/globals.css apps/main-site/src/components/ui/Button.tsx apps/main-site/src/app/troubleshooting/page.tsx
git commit -m "feat(main-site): Stitch color tokens and Inter font with AA contrast check"
```

---

### Task 2: Working table of contents for database articles

**Files:**
- Create: `apps/main-site/src/lib/toc.ts`, `apps/main-site/tests/toc.test.mjs`
- Modify: `apps/main-site/src/components/blog/TableOfContents.tsx`, `apps/main-site/src/app/blog/[slug]/page.tsx` (TOC wiring only)

**Interfaces:**
- Produces: `interface TocHeading { id: string; text: string; level: 2 | 3 }`; `addHeadingIds(html: string): { html: string; headings: TocHeading[] }`; `extractMarkdownHeadings(md: string): TocHeading[]`; `<TableOfContents headings={TocHeading[]} />`.
- Context: the old component parsed Markdown `##` only, so database (HTML) articles got no TOC and their `<h2>` had no ids (verified on the live site).

- [ ] **Step 1: Write the failing tests**

Create `apps/main-site/tests/toc.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { addHeadingIds, extractMarkdownHeadings } from "../src/lib/toc.ts";

test("adds ids to h2 and h3 and lists them", () => {
  const { html, headings } = addHeadingIds("<h2>Start it</h2><p>x</p><h3>Sub part</h3>");
  assert.equal(html, '<h2 id="start-it">Start it</h2><p>x</p><h3 id="sub-part">Sub part</h3>');
  assert.deepEqual(headings, [
    { id: "start-it", text: "Start it", level: 2 },
    { id: "sub-part", text: "Sub part", level: 3 },
  ]);
});

test("duplicate headings get unique ids", () => {
  const { html, headings } = addHeadingIds("<h2>FAQ</h2><h2>FAQ</h2>");
  assert.deepEqual(headings.map((h) => h.id), ["faq", "faq-2"]);
  assert.equal(html, '<h2 id="faq">FAQ</h2><h2 id="faq-2">FAQ</h2>');
});

test("strips inline tags and decodes entities", () => {
  const { headings } = addHeadingIds("<h2>Use <code>dart mcp-server</code> &amp; more</h2>");
  assert.equal(headings[0].text, "Use dart mcp-server & more");
  assert.equal(headings[0].id, "use-dart-mcp-server-more");
});

test("keeps an existing id and lists it", () => {
  const { html, headings } = addHeadingIds('<h2 id="custom">Hello</h2>');
  assert.equal(html, '<h2 id="custom">Hello</h2>');
  assert.equal(headings[0].id, "custom");
});

test("a repeated existing id is made unique", () => {
  const { html, headings } = addHeadingIds('<h2 id="a">One</h2><h2 id="a">Two</h2>');
  assert.deepEqual(headings.map((h) => h.id), ["a", "a-2"]);
  assert.equal(html, '<h2 id="a">One</h2><h2 id="a-2">Two</h2>');
});

test("non-ASCII heading falls back to section-N", () => {
  const { headings } = addHeadingIds("<h2>مرحبا</h2><h2>أهلا</h2>");
  assert.deepEqual(headings.map((h) => h.id), ["section-1", "section-2"]);
});

test("empty headings are skipped and left untouched", () => {
  const input = "<h2> </h2>";
  const { html, headings } = addHeadingIds(input);
  assert.equal(html, input);
  assert.deepEqual(headings, []);
});

test("h1 and h4 are ignored", () => {
  const { headings } = addHeadingIds("<h1>A</h1><h4>B</h4>");
  assert.deepEqual(headings, []);
});

test("other attributes are preserved", () => {
  const { html } = addHeadingIds('<h2 class="x">Hi</h2>');
  assert.equal(html, '<h2 class="x" id="hi">Hi</h2>');
});

test("multi-line heading text works", () => {
  const { headings } = addHeadingIds("<h2>\n  Two\n  lines\n</h2>");
  assert.equal(headings[0].text, "Two lines");
});

test("escaped heading markup inside code is not matched", () => {
  const { headings } = addHeadingIds("<pre><code>&lt;h2&gt;Nope&lt;/h2&gt;</code></pre>");
  assert.deepEqual(headings, []);
});

test("markdown: ignores fenced code, dedupes like github-slugger", () => {
  const md = "## Intro\n\n```md\n## Not a heading\n```\n\n### Setup\n\n## Intro\n";
  assert.deepEqual(extractMarkdownHeadings(md), [
    { id: "intro", text: "Intro", level: 2 },
    { id: "setup", text: "Setup", level: 3 },
    { id: "intro-1", text: "Intro", level: 2 },
  ]);
});
```

- [ ] **Step 2: Run to verify failure**

Run (from `apps/main-site`): `node --test tests/toc.test.mjs`
Expected: FAIL, cannot find `../src/lib/toc.ts`.

- [ ] **Step 3: Implement**

Create `apps/main-site/src/lib/toc.ts` (erasable TypeScript only, no path aliases, so Node can run it directly):

```ts
export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

function plainText(inner: string): string {
  return inner
    .replace(/<[^>]*>/g, "")
    .replace(/&(?:amp|lt|gt|quot|#39);/g, (m) => ENTITIES[m])
    .replace(/\s+/g, " ")
    .trim();
}

function slugFrom(text: string): string {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-");
}

/** Adds a unique id to every h2/h3 in an HTML string and returns them for a table of contents. */
export function addHeadingIds(html: string): { html: string; headings: TocHeading[] } {
  const headings: TocHeading[] = [];
  const used = new Set<string>();
  let fallback = 0;

  const out = html.replace(
    /<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/gi,
    (full: string, lvl: string, attrs: string | undefined, inner: string) => {
      const text = plainText(inner);
      if (!text) return full;

      const attrText = attrs ?? "";
      const existing = /\sid=(?:"([^"]*)"|'([^']*)')/i.exec(attrText);
      let base = existing ? (existing[1] ?? existing[2] ?? "") : slugFrom(text);
      if (!base) base = `section-${++fallback}`;

      let id = base;
      let n = 2;
      while (used.has(id)) id = `${base}-${n++}`;
      used.add(id);

      headings.push({ id, text, level: Number(lvl) as 2 | 3 });

      if (existing && id === base) return full;
      const cleaned = attrText.replace(/\sid=(?:"[^"]*"|'[^']*')/i, "");
      return `<h${lvl}${cleaned} id="${id}">${inner}</h${lvl}>`;
    },
  );

  return { html: out, headings };
}

/** Headings for MDX articles; ids mirror rehype-slug (github-slugger style, duplicates get -1, -2). */
export function extractMarkdownHeadings(md: string): TocHeading[] {
  const body = md.replace(/```[\s\S]*?```/g, "");
  const re = /^(#{2,3})\s+(.+)$/gm;
  const seen = new Map<string, number>();
  const out: TocHeading[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const text = m[2].trim();
    const base = slugFrom(text) || "section";
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    out.push({ id: count === 0 ? base : `${base}-${count}`, text, level: m[1].length as 2 | 3 });
  }
  return out;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `node --test tests/toc.test.mjs`
Expected: all tests pass.

- [ ] **Step 5: Rewrite the TableOfContents component to take headings**

Replace `apps/main-site/src/components/blog/TableOfContents.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import type { TocHeading } from "@/lib/toc";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <div className="p-4 rounded-xl border border-border bg-bg-card">
      <p className="text-xs font-mono text-ink-faint mb-3">// on this page</p>
      <nav aria-label="On this page" className="flex flex-col gap-1">
        {headings.map((h) => (
          <a
            key={h.id}
            href={`#${h.id}`}
            className={`text-sm py-1 leading-snug transition-colors border-l-2 ${
              h.level === 3 ? "pl-5" : "pl-3"
            } ${
              active === h.id
                ? "text-accent-light border-accent bg-accent/5"
                : "text-ink-muted border-transparent hover:text-ink hover:border-border-strong"
            }`}
          >
            {h.text}
          </a>
        ))}
      </nav>
    </div>
  );
}
```

- [ ] **Step 6: Wire it into the article page**

In `apps/main-site/src/app/blog/[slug]/page.tsx`:
- add `import { addHeadingIds, extractMarkdownHeadings } from "@/lib/toc";`
- after `const postUrl = ...;` add:

```tsx
  const toc = post.source === "db"
    ? addHeadingIds(post.content)
    : { html: post.content, headings: extractMarkdownHeadings(post.content) };
```
- change `<div dangerouslySetInnerHTML={{ __html: post.content }} />` to `<div dangerouslySetInnerHTML={{ __html: toc.html }} />`
- change `<TableOfContents content={post.content} />` to `<TableOfContents headings={toc.headings} />`

- [ ] **Step 7: Verify**

From repo root: `npx tsc --noEmit -p apps/main-site/tsconfig.json` (no output). Then build and check a database article:
`grep -c "// on this page" apps/main-site/.next/server/app/blog/dart-flutter-mcp-server-explained.html` (expected: 1 or more) and
`grep -o '<h2 id="[a-z0-9-]*"' apps/main-site/.next/server/app/blog/dart-flutter-mcp-server-explained.html | head -3` (expected: ids present).

- [ ] **Step 8: Commit (only if the owner asked for commits)**

```bash
git add apps/main-site/src/lib/toc.ts apps/main-site/tests/toc.test.mjs apps/main-site/src/components/blog/TableOfContents.tsx "apps/main-site/src/app/blog/[slug]/page.tsx"
git commit -m "fix(main-site): table of contents now works for database articles"
```

---

### Task 3: Header, Footer, mobile tab bar

**Files:**
- Create: `apps/main-site/src/lib/site-links.ts`, `apps/main-site/src/components/layout/LogoMark.tsx`
- Modify: `apps/main-site/src/components/layout/Header.tsx`, `apps/main-site/src/components/layout/Footer.tsx`, `apps/main-site/src/app/layout.tsx` (body class)

**Interfaces:**
- Produces: `SOCIAL_LINKS` (readonly array of `{ label, href }`), `PORTFOLIO_URL` string; `<LogoMark size?: "sm" | "md" />`.
- Consumes: `Button` (Task 1) with props `href`, `size`, `className`.

- [ ] **Step 1: Shared links and logo mark**

Create `apps/main-site/src/lib/site-links.ts`:

```ts
export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/BilalFali" },
  { label: "YouTube", href: "https://youtube.com/@bidev97" },
  { label: "LinkedIn", href: "https://linkedin.com/in/falibilal" },
] as const;

export const PORTFOLIO_URL = "https://portfolio.bidev.dev";
```

Create `apps/main-site/src/components/layout/LogoMark.tsx`:

```tsx
import { Terminal } from "lucide-react";

export function LogoMark({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const icon = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <span
      aria-hidden="true"
      className={`${box} rounded-lg bg-bg-elevated border border-border flex items-center justify-center text-accent-light`}
    >
      <Terminal className={icon} strokeWidth={2} />
    </span>
  );
}
```

- [ ] **Step 2: Replace Header.tsx**

Replace `apps/main-site/src/components/layout/Header.tsx` with:

```tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, Menu, Home, Wrench, BookOpen, Code2 } from "lucide-react";
import { LogoMark } from "@/components/layout/LogoMark";
import { Button } from "@/components/ui/Button";

const NAV = [
  { label: "Articles", href: "/blog" },
  { label: "Learn", href: "/learn" },
  { label: "Troubleshooting", href: "/troubleshooting" },
  { label: "Tools", href: "/tools" },
  { label: "AI", href: "/ai-tools" },
  { label: "Interview", href: "/flutter-interview-questions" },
];

const TABS = [
  { label: "Home", href: "/", icon: Home },
  { label: "Tools", href: "/tools", icon: Wrench },
  { label: "Articles", href: "/blog", icon: BookOpen },
  { label: "Interview", href: "/flutter-interview-questions", icon: Code2 },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searching, setSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const desktopSearchRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => { setOpen(false); setSearching(false); }, [pathname]);

  // Focus whichever input is actually visible (the other one is display:none).
  useEffect(() => {
    if (!searching) return;
    const desktop = window.matchMedia("(min-width: 768px)").matches;
    (desktop ? desktopSearchRef : mobileSearchRef).current?.focus();
  }, [searching]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearching(true);
      }
      if (e.key === "Escape") setSearching(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const isActive = (href: string) => {
    if (!mounted) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearching(false);
      setQuery("");
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-200 ${
          scrolled ? "glass border-b border-border" : "border-b border-border/30"
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="BiDev home">
              <LogoMark />
              <span className="text-base font-semibold tracking-tight text-ink">BiDev</span>
            </Link>

            <nav aria-label="Main" className="hidden md:flex items-stretch gap-6 self-stretch flex-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`flex items-center text-sm border-b-2 transition-colors ${
                    isActive(item.href)
                      ? "text-accent-light border-accent font-medium"
                      : "text-ink-muted border-transparent hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 ml-auto">
              {searching ? (
                <form onSubmit={handleSearch}>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border focus-within:border-accent transition-colors w-56">
                    <Search className="w-3.5 h-3.5 text-ink-faint shrink-0" />
                    <input
                      ref={desktopSearchRef}
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search everything…"
                      aria-label="Search"
                      className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
                    />
                    <button type="button" aria-label="Close search" onClick={() => { setSearching(false); setQuery(""); }}>
                      <X className="w-3.5 h-3.5 text-ink-faint hover:text-ink transition-colors" />
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setSearching(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-elevated border border-border text-ink-faint text-sm hover:text-ink hover:border-border-strong transition-all"
                  aria-label="Search"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span className="hidden lg:block text-xs">Search guides, tools, questions…</span>
                  <kbd className="hidden lg:block text-[10px] px-1.5 py-0.5 rounded bg-bg-card border border-border font-mono">⌘K</kbd>
                </button>
              )}
              <Button href="/#newsletter" size="sm">Subscribe</Button>
            </div>

            <div className="flex items-center md:hidden ml-auto">
              <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-bg-elevated transition-colors"
                aria-label="Toggle menu"
                aria-expanded={open}
              >
                {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {searching && (
            <div className="md:hidden pb-3">
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-bg-elevated border border-border focus-within:border-accent transition-colors">
                  <Search className="w-4 h-4 text-ink-faint shrink-0" />
                  <input
                    ref={mobileSearchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search guides, tools, questions…"
                    aria-label="Search"
                    className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
                  />
                </div>
              </form>
            </div>
          )}
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-bg-card">
            <nav aria-label="Menu" className="flex flex-col p-3 gap-0.5">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive(item.href)
                      ? "text-ink bg-bg-elevated font-medium"
                      : "text-ink-muted hover:text-ink hover:bg-bg-elevated"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      <nav
        aria-label="Quick navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-border px-3 pb-[env(safe-area-inset-bottom)] flex items-center justify-around"
      >
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={isActive(tab.href) ? "page" : undefined}
            className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg font-mono text-[10px] transition-colors active:scale-95 motion-reduce:active:scale-100 ${
              isActive(tab.href) ? "text-accent-light" : "text-ink-muted hover:text-accent-light"
            }`}
          >
            <tab.icon className="w-5 h-5" strokeWidth={1.75} />
            {tab.label}
          </Link>
        ))}
        <button
          type="button"
          onClick={() => { setSearching(true); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg font-mono text-[10px] text-ink-muted hover:text-accent-light transition-colors active:scale-95 motion-reduce:active:scale-100"
        >
          <Search className="w-5 h-5" strokeWidth={1.75} />
          Search
        </button>
      </nav>
    </>
  );
}
```

- [ ] **Step 3: Replace Footer.tsx**

Replace `apps/main-site/src/components/layout/Footer.tsx` with:

```tsx
import Link from "next/link";
import { BuyMeCoffee } from "@/components/BuyMeCoffee";
import { LogoMark } from "@/components/layout/LogoMark";
import { SOCIAL_LINKS, PORTFOLIO_URL } from "@/lib/site-links";

const LINKS = {
  Platform: [
    { label: "Articles",       href: "/blog" },
    { label: "Topics",         href: "/topics" },
    { label: "Snippets",       href: "/snippets" },
    { label: "Tools",          href: "/tools" },
    { label: "AI Tools",       href: "/ai-tools" },
    { label: "Resources",      href: "/resources" },
    { label: "Interview Prep", href: "/flutter-interview-questions" },
    { label: "Jobs",           href: "/jobs" },
    { label: "Products",       href: "/products" },
    { label: "Packages",       href: "/packages" },
    { label: "Flutter",        href: "/flutter" },
  ],
  Community: [
    { label: "About",          href: "/about" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms",          href: "/terms" },
    { label: "Portfolio",      href: PORTFOLIO_URL },
  ],
  Social: [
    ...SOCIAL_LINKS,
    { label: "RSS Feed", href: "/feed.xml" },
    { label: "Sitemap",  href: "/sitemap.xml" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border mt-16 bg-bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-ink">
              <LogoMark size="sm" />
              BiDev
            </Link>
            <p className="text-sm text-ink-faint leading-relaxed max-w-[240px]">
              Flutter tutorials, fixes for real errors, and free developer tools.
            </p>
            <BuyMeCoffee variant="footer" />
          </div>

          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section} className="flex flex-col gap-3">
              <h3 className="text-xs font-mono text-ink-faint">{`// ${section.toLowerCase()}`}</h3>
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm text-ink-muted hover:text-accent-light transition-colors"
                  {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-border text-xs text-ink-faint">
          <p>&copy; {new Date().getFullYear()} BiDev. Built for Flutter developers.</p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Keep the tab bar from covering the page**

In `apps/main-site/src/app/layout.tsx`, change the body class `"bg-bg text-ink min-h-screen flex flex-col antialiased"` to `"bg-bg text-ink min-h-screen flex flex-col antialiased pb-16 md:pb-0"`.

- [ ] **Step 5: Verify**

`npx tsc --noEmit -p apps/main-site/tsconfig.json` (no output); build; then
`grep -c 'href="/#newsletter"' apps/main-site/.next/server/app/index.html` (at least 1), `grep -c "next.js" apps/main-site/.next/server/app/index.html` and `grep -c "echo" apps/main-site/.next/server/app/index.html` (the footer's old `$ echo` line must not come back; 0 for the footer text). Manual: at 375px the bottom bar shows Home, Tools, Articles, Interview, Search, does not hide footer links, and Search opens the input under the header and focuses it.

- [ ] **Step 6: Commit (only if the owner asked for commits)**

```bash
git add apps/main-site/src/lib/site-links.ts apps/main-site/src/components/layout apps/main-site/src/app/layout.tsx
git commit -m "feat(main-site): Stitch header, footer and mobile tab bar"
```

---

### Task 4: Homepage

**Files:**
- Create: `apps/main-site/src/lib/topics.ts`, `apps/main-site/tests/topics.test.mjs`, `apps/main-site/src/components/home/SectionHeading.tsx`, `apps/main-site/src/components/home/JsonToDartPreview.tsx`, `apps/main-site/src/components/home/TrustStrip.tsx`
- Modify: `apps/main-site/src/app/page.tsx`

**Interfaces:**
- Produces: `topTags(articles: { tags: string[] }[], limit?: number): { tag: string; count: number }[]`; `<SectionHeading eyebrow tone? title subtitle? href linkLabel />` where `tone` is `"accent" | "teal" | "tertiary" | "danger"`.
- Consumes: `PORTFOLIO_URL` (Task 3), `getAllProducts`, `formatPrice` from `@/lib/products`.

- [ ] **Step 1: Write the failing test for topTags**

Create `apps/main-site/tests/topics.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { topTags } from "../src/lib/topics.ts";

test("counts each tag once per article", () => {
  const result = topTags([{ tags: ["a", "a", "b"] }, { tags: ["a"] }]);
  assert.deepEqual(result, [{ tag: "a", count: 2 }, { tag: "b", count: 1 }]);
});

test("ties sort alphabetically", () => {
  const result = topTags([{ tags: ["z"] }, { tags: ["m"] }]);
  assert.deepEqual(result.map((r) => r.tag), ["m", "z"]);
});

test("respects the limit", () => {
  const result = topTags([{ tags: ["a", "b", "c", "d"] }], 2);
  assert.equal(result.length, 2);
});

test("empty input and articles without tags give an empty list", () => {
  assert.deepEqual(topTags([]), []);
  assert.deepEqual(topTags([{ tags: [] }]), []);
});
```

- [ ] **Step 2: Run to verify failure**

Run (from `apps/main-site`): `node --test tests/topics.test.mjs`
Expected: FAIL, cannot find `../src/lib/topics.ts`.

- [ ] **Step 3: Implement topTags**

Create `apps/main-site/src/lib/topics.ts`:

```ts
export function topTags(
  articles: { tags: string[] }[],
  limit = 8,
): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const article of articles) {
    for (const tag of new Set(article.tags)) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag))
    .slice(0, limit);
}
```

- [ ] **Step 4: Run to verify pass**

Run: `node --test tests/topics.test.mjs`
Expected: all pass.

- [ ] **Step 5: SectionHeading**

Create `apps/main-site/src/components/home/SectionHeading.tsx`:

```tsx
import Link from "next/link";

const TONES = {
  accent: "text-accent-light",
  teal: "text-teal",
  tertiary: "text-tertiary",
  danger: "text-danger",
} as const;

export function SectionHeading({
  eyebrow,
  tone = "accent",
  title,
  subtitle,
  href,
  linkLabel,
}: {
  eyebrow: string;
  tone?: keyof typeof TONES;
  title: string;
  subtitle?: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-7">
      <div>
        <p className={`font-mono text-xs mb-1.5 ${TONES[tone]}`}>{`// ${eyebrow}`}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
      </div>
      <Link href={href} className="text-sm text-accent-light hover:text-ink transition-colors whitespace-nowrap mb-1">
        {linkLabel}
      </Link>
    </div>
  );
}
```

- [ ] **Step 6: JsonToDartPreview and TrustStrip**

Create `apps/main-site/src/components/home/JsonToDartPreview.tsx`:

```tsx
import Link from "next/link";

export function JsonToDartPreview() {
  return (
    <figure
      aria-label="Example: a JSON object and the Dart class generated from it"
      className="terminal-window shadow-terminal"
    >
      <div className="terminal-titlebar justify-between">
        <div className="flex items-center gap-1.5">
          <span className="terminal-dot" style={{ background: "#f87171" }} />
          <span className="terminal-dot" style={{ background: "#fbbf24" }} />
          <span className="terminal-dot" style={{ background: "#4ade80" }} />
          <span className="ml-2 text-ink-faint text-[11px] font-mono">user_model.dart</span>
        </div>
        <Link href="/tools/json-to-dart" className="text-[11px] font-mono text-accent-light hover:text-ink transition-colors">
          Open tool
        </Link>
      </div>

      <div className="grid md:grid-cols-2 md:divide-x divide-border font-mono text-[12.5px] leading-relaxed">
        <pre className="p-4 overflow-x-auto bg-bg-secondary/60 text-ink-muted"><code>
{`{
  `}<span className="text-teal">&quot;id&quot;</span>{`: `}<span className="text-tertiary">402</span>{`,
  `}<span className="text-teal">&quot;name&quot;</span>{`: `}<span className="text-teal">&quot;Bilal&quot;</span>{`,
  `}<span className="text-teal">&quot;is_pro&quot;</span>{`: `}<span className="text-accent-light">true</span>{`
}`}</code></pre>
        <pre className="p-4 overflow-x-auto text-ink-muted"><code>
<span className="text-accent-light">class</span>{` `}<span className="text-teal">UserModel</span>{` {
  `}<span className="text-accent-light">final</span>{` `}<span className="text-teal">int</span>{` id;
  `}<span className="text-accent-light">final</span>{` `}<span className="text-teal">String</span>{` name;
  `}<span className="text-accent-light">final</span>{` `}<span className="text-teal">bool</span>{` isPro;

  `}<span className="text-accent-light">const</span>{` UserModel({
    `}<span className="text-accent-light">required</span>{` this.id,
    `}<span className="text-accent-light">required</span>{` this.name,
    `}<span className="text-accent-light">required</span>{` this.isPro,
  });
}`}</code></pre>
      </div>

      <figcaption className="px-4 py-2 border-t border-border text-[11px] font-mono text-ink-faint">
        Example. The real tool also generates fromJson, toJson and copyWith.
      </figcaption>
    </figure>
  );
}
```

Create `apps/main-site/src/components/home/TrustStrip.tsx`:

```tsx
import Link from "next/link";
import { BadgeCheck, Smartphone, ShieldCheck } from "lucide-react";
import { PORTFOLIO_URL } from "@/lib/site-links";

const ITEMS = [
  {
    icon: BadgeCheck,
    title: "Built by Bilal Fali",
    text: "A Flutter developer who ships real apps.",
    href: "/about",
  },
  {
    icon: Smartphone,
    title: "Apps live on Google Play",
    text: "See the production apps behind these guides.",
    href: `${PORTFOLIO_URL}/work`,
  },
  {
    icon: ShieldCheck,
    title: "Free tools, no sign-up",
    text: "Instant, and they run in your browser.",
    href: "/tools",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="About this site" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-border py-5">
        {ITEMS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-bg-card transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent-light shrink-0">
              <item.icon className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink group-hover:text-accent-light transition-colors">{item.title}</span>
              <span className="block text-xs text-ink-muted">{item.text}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Rewrite the homepage**

Replace `apps/main-site/src/app/page.tsx` with the content below. Sections not named in the spec (Learn, Solve a problem, Latest, Tools bento, Interview, Resources) keep their existing data and markup, with `SectionHeading` taking an eyebrow.

```tsx
import Link from "next/link";
import { Check } from "lucide-react";
import { getAllBlogArticles } from "@/lib/articles";
import { slugify } from "@/lib/utils";
import { TOOLS, type Tool } from "@/lib/tools";
import { RESOURCES, RESOURCE_CATEGORIES, RESOURCE_CATEGORY_ICONS, RESOURCE_CATEGORY_FALLBACK_ICON } from "@/lib/resources";
import { LEARN_CATEGORIES } from "@/lib/learn";
import { getFeaturedTroubleshooting } from "@/lib/troubleshooting";
import { getAllInterviewQuestions, INTERVIEW_CATEGORIES, DIFFICULTIES } from "@/lib/interview-questions";
import { getAllProducts, formatPrice } from "@/lib/products";
import { topTags } from "@/lib/topics";
import { ToolCard } from "@/components/tools/ToolCard";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { TroubleshootingCard } from "@/components/blog/TroubleshootingCard";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/home/SectionHeading";
import { JsonToDartPreview } from "@/components/home/JsonToDartPreview";
import { TrustStrip } from "@/components/home/TrustStrip";
import { AdSlot } from "@bidev/ui";

export const revalidate = 60;

export default async function HomePage() {
  const [allArticles, interviewQuestions, problemGuides, products] = await Promise.all([
    getAllBlogArticles(),
    getAllInterviewQuestions(),
    getFeaturedTroubleshooting(4),
    getAllProducts(),
  ]);
  const latest       = allArticles.slice(0, 6);
  const topics       = topTags(allArticles, 8);
  const resourceCats = RESOURCE_CATEGORIES.slice(1);
  const popularTools = TOOLS.filter((t) => t.popular);
  const otherTools   = TOOLS.filter((t) => !t.popular);

  return (
    <div className="flex flex-col">

      {/* HERO */}
      <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-14 pb-16 overflow-hidden">
        <div aria-hidden="true" className="widget-tree-bg pointer-events-none absolute inset-x-0 top-0 h-80" />
        <div className="relative grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 animate-fade-in">
            <p className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-bg-card border border-border font-mono text-[11px] text-teal">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-teal motion-safe:animate-pulse" />
              Built for Flutter developers
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-5 leading-[1.08] tracking-tight">
              Flutter knowledge from{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-teal">
                real production apps
              </span>
            </h1>
            <p className="text-ink-muted max-w-md mb-8 text-lg leading-relaxed">
              Tutorials, free tools, and snippets built by a developer who ships apps to Google Play.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/tools" prompt>Browse tools</Button>
              <Button href="/blog" variant="secondary">Read articles</Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <JsonToDartPreview />
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* LEARN FLUTTER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <SectionHeading eyebrow="learn" title="Learn Flutter" href="/learn" linkLabel="See all topics" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEARN_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/learn/${cat.slug}`}
              className="group flex gap-4 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 transition-colors"
            >
              <cat.icon className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="flex flex-col gap-1.5 min-w-0">
                <h3 className="font-semibold text-ink group-hover:text-accent-light transition-colors text-sm">{cat.name}</h3>
                <p className="text-xs text-ink-faint leading-relaxed line-clamp-2">{cat.intro}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SOLVE A PROBLEM */}
      {problemGuides.length > 0 && (
        <section id="solve-a-problem" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10 scroll-mt-20">
          <SectionHeading
            eyebrow="fix errors"
            tone="danger"
            title="Solve a Flutter problem"
            subtitle="Stuck on an error? Find a practical fix."
            href="/troubleshooting"
            linkLabel="See all troubleshooting"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {problemGuides.map((article) => (
              <TroubleshootingCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* LATEST ARTICLES */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <SectionHeading
            eyebrow="guides"
            title="Latest articles"
            href="/blog"
            linkLabel={`All ${allArticles.length} articles`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((article, i) => (
              <ArticleCard key={article.slug} article={article} priority={i < 3} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      {/* FEATURED TOOLS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <SectionHeading
          eyebrow="free utilities"
          tone="teal"
          title="Most-used tools"
          subtitle="Free, instant, runs in your browser."
          href="/tools"
          linkLabel={`All ${TOOLS.length} tools`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-7 mb-5">
          {popularTools[0] && <BentoCard tool={popularTools[0]} />}
          {popularTools[1] && <ToolCard tool={popularTools[1]} />}
          {popularTools[2] && <ToolCard tool={popularTools[2]} />}
          {popularTools[3] && <BentoCard tool={popularTools[3]} />}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* INTERVIEW PREP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="p-8 rounded-2xl border border-accent/30 bg-bg-card">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="font-mono text-xs mb-1.5 text-accent-light">// interview prep</p>
              <h2 className="text-xl sm:text-2xl font-bold text-ink">Flutter interview questions &amp; answers</h2>
              <p className="text-sm text-ink-muted mt-1">
                {interviewQuestions.length}+ questions across {INTERVIEW_CATEGORIES.length} categories, from {DIFFICULTIES[0]} to {DIFFICULTIES[DIFFICULTIES.length - 1]}.
              </p>
            </div>
            <Button href="/flutter-interview-questions" size="md" className="shrink-0">Start practicing</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <Link
                key={d}
                href={`/flutter-interview-questions/${d.toLowerCase()}`}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-bg-elevated text-ink-muted hover:text-accent-light hover:border-accent/40 transition-colors"
              >
                {d}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BROWSE BY TOPIC */}
      {topics.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <SectionHeading eyebrow="browse by topic" title="Find articles by topic" href="/topics" linkLabel="All topics" />
          <div className="flex flex-wrap gap-3">
            {topics.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-bg-card text-sm text-ink hover:border-accent/40 hover:bg-bg-elevated transition-colors"
              >
                <span>{tag}</span>
                <span className="font-mono text-xs text-ink-faint">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* RESOURCE HUB */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <SectionHeading eyebrow="resources" title="Flutter resources hub" href="/resources" linkLabel="See all resources" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourceCats.map((cat) => {
            const count = RESOURCES.filter((r) => r.category === cat).length;
            const Icon = RESOURCE_CATEGORY_ICONS[cat] ?? RESOURCE_CATEGORY_FALLBACK_ICON;
            return (
              <Link
                key={cat}
                href={`/resources#${slugify(cat)}`}
                className="group flex flex-col gap-2 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 transition-colors"
              >
                <Icon className="w-5 h-5 text-accent" strokeWidth={1.75} />
                <h3 className="font-semibold text-ink group-hover:text-accent-light transition-colors text-sm">{cat}</h3>
                <p className="text-xs text-ink-faint">{count} resources</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS */}
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <SectionHeading
            eyebrow="starter kits"
            tone="tertiary"
            title="Production templates"
            subtitle="Skip the boilerplate and start from working code."
            href="/products"
            linkLabel="All products"
          />
          <div className={products.length > 1 ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "max-w-xl"}>
            {products.slice(0, 2).map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group flex flex-col gap-4 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold px-2.5 py-1 rounded bg-accent/10 text-accent-light border border-accent/20">
                    {formatPrice(p.price)}
                  </span>
                  {p.badge && (
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-teal-muted text-teal border border-teal/25">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink group-hover:text-accent-light transition-colors">{p.title}</h3>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">{p.short_description}</p>
                </div>
                {p.features.length > 0 && (
                  <ul className="flex flex-col gap-2 text-sm text-ink-muted">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <span className="mt-auto pt-4 border-t border-border text-sm text-accent-light">View product</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="in-article" />
      </div>

      {/* NEWSLETTER */}
      <section id="newsletter" className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 w-full py-16 scroll-mt-20">
        <div className="rounded-xl border border-border bg-bg-card p-8 text-center">
          <h2 className="text-2xl font-bold text-ink mb-3">Stay in the loop</h2>
          <p className="text-ink-muted mb-6">
            Flutter tips, new tools, and articles, straight to your inbox. No spam.
          </p>
          <NewsletterForm />
        </div>
      </section>

    </div>
  );
}

/* Bento wide card (col-span-2 on sm+) */
function BentoCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col gap-4 p-7 rounded-xl border border-accent/20 bg-bg-card hover:border-accent/50 transition-colors sm:col-span-2"
    >
      <span className="absolute top-5 right-5 text-[10px] font-mono px-2 py-1 rounded bg-signal-muted text-signal border border-signal/25">
        popular
      </span>
      <tool.icon className="w-9 h-9 text-accent" strokeWidth={1.75} />
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-ink text-base group-hover:text-accent-light transition-colors">
          {tool.title}
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed">{tool.description}</p>
      </div>
      <div className="flex gap-1.5">
        {tool.tags.map((t) => (
          <span key={t} className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
```

- [ ] **Step 8: Verify**

`npx tsc --noEmit -p apps/main-site/tsconfig.json` (no output); `node --test apps/main-site/tests/` (all pass); build. Then check the built homepage `apps/main-site/.next/server/app/index.html`:
- contains `id="newsletter"`, `real production apps`, `Production templates`, `Find articles by topic`
- contains the real article count text `All ` followed by the real number plus ` articles`
- does not contain `48 articles`, `Flutter 3.29`, `0ms`.
If `getAllProducts()` returns an empty list at build time (no Supabase env), the Products section is correctly absent.

- [ ] **Step 9: Commit (only if the owner asked for commits)**

```bash
git add apps/main-site/src/lib/topics.ts apps/main-site/tests/topics.test.mjs apps/main-site/src/components/home apps/main-site/src/app/page.tsx
git commit -m "feat(main-site): Stitch homepage with real tools, topics and products"
```

---

### Task 5: Article page layout

**Files:**
- Create: `apps/main-site/src/lib/adjacent.ts`, `apps/main-site/src/lib/article-tools.ts`, `apps/main-site/tests/adjacent.test.mjs`, `apps/main-site/tests/article-tools.test.mjs`, `apps/main-site/src/components/blog/ArticleHero.tsx`, `ArticleSidebar.tsx`, `AuthorBox.tsx`, `RelatedToolBanner.tsx`, `PrevNextArticles.tsx`
- Modify: `apps/main-site/src/app/blog/[slug]/page.tsx` (non-troubleshooting return and imports)

**Interfaces:**
- Produces: `pickAdjacent<T extends { slug: string; publishedAt: string; categorySlug?: string }>(all: T[], currentSlug: string): { prev: T | null; next: T | null }` (prev is older, next is newer, same category); `toolSlugForTags(tags: string[]): string | null` and `TAG_TOOL_MAP: ReadonlyMap<string, string>`.
- Consumes: `TocHeading` and `addHeadingIds` (Task 2), `SOCIAL_LINKS` (Task 3), `getAllBlogArticles` and `Article` from `@/lib/articles`, `TOOLS` and `Tool` from `@/lib/tools`.

- [ ] **Step 1: Write failing tests**

Create `apps/main-site/tests/adjacent.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { pickAdjacent } from "../src/lib/adjacent.ts";

const a = (slug, publishedAt, categorySlug) => ({ slug, publishedAt, categorySlug });

test("middle article has both neighbours, older is prev", () => {
  const all = [a("c", "2026-03-01", "x"), a("a", "2026-01-01", "x"), a("b", "2026-02-01", "x")];
  const r = pickAdjacent(all, "b");
  assert.equal(r.prev.slug, "a");
  assert.equal(r.next.slug, "c");
});

test("first has no prev, last has no next", () => {
  const all = [a("a", "2026-01-01", "x"), a("b", "2026-02-01", "x")];
  assert.equal(pickAdjacent(all, "a").prev, null);
  assert.equal(pickAdjacent(all, "a").next.slug, "b");
  assert.equal(pickAdjacent(all, "b").next, null);
});

test("only article has neither", () => {
  assert.deepEqual(pickAdjacent([a("a", "2026-01-01", "x")], "a"), { prev: null, next: null });
});

test("unknown slug gives neither", () => {
  assert.deepEqual(pickAdjacent([a("a", "2026-01-01", "x")], "zzz"), { prev: null, next: null });
});

test("other categories are skipped", () => {
  const all = [a("a", "2026-01-01", "x"), a("b", "2026-02-01", "y"), a("c", "2026-03-01", "x")];
  assert.equal(pickAdjacent(all, "a").next.slug, "c");
});

test("no category means the whole pool", () => {
  const all = [a("a", "2026-01-01"), a("b", "2026-02-01", "y")];
  assert.equal(pickAdjacent(all, "a").next.slug, "b");
});

test("same date ties break by slug and an invalid date does not throw", () => {
  const all = [a("b", "2026-01-01", "x"), a("a", "2026-01-01", "x"), a("c", "not-a-date", "x")];
  const r = pickAdjacent(all, "b");
  assert.ok(r.prev === null || typeof r.prev.slug === "string");
});
```

Create `apps/main-site/tests/article-tools.test.mjs`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { toolSlugForTags, TAG_TOOL_MAP } from "../src/lib/article-tools.ts";

test("first matching tag in article order wins", () => {
  assert.equal(toolSlugForTags(["flutter", "authentication", "api"]), "jwt-decoder");
});

test("matching is case-insensitive", () => {
  assert.equal(toolSlugForTags(["API"]), "json-to-dart");
});

test("no match and empty tags give null", () => {
  assert.equal(toolSlugForTags(["flutter", "riverpod"]), null);
  assert.equal(toolSlugForTags([]), null);
});

test("object-property names never match", () => {
  assert.equal(toolSlugForTags(["constructor", "toString", "__proto__", "hasOwnProperty"]), null);
});

test("every mapped tool slug exists in tools.ts", () => {
  const source = readFileSync(new URL("../src/lib/tools.ts", import.meta.url), "utf8");
  for (const slug of TAG_TOOL_MAP.values()) {
    assert.ok(source.includes(`slug: "${slug}"`), `tools.ts has no tool with slug ${slug}`);
  }
});
```

- [ ] **Step 2: Run to verify failure**

Run (from `apps/main-site`): `node --test tests/adjacent.test.mjs tests/article-tools.test.mjs`
Expected: FAIL, modules not found.

- [ ] **Step 3: Implement helpers**

Create `apps/main-site/src/lib/adjacent.ts`:

```ts
export interface Dated {
  slug: string;
  publishedAt: string;
  categorySlug?: string;
}

/** Neighbours by publish date inside the current article's category. prev is older, next is newer. */
export function pickAdjacent<T extends Dated>(
  all: T[],
  currentSlug: string,
): { prev: T | null; next: T | null } {
  const current = all.find((a) => a.slug === currentSlug);
  if (!current) return { prev: null, next: null };

  const pool = all
    .filter((a) => (current.categorySlug ? a.categorySlug === current.categorySlug : true))
    .sort((a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt) || a.slug.localeCompare(b.slug));

  const i = pool.findIndex((a) => a.slug === currentSlug);
  return {
    prev: i > 0 ? pool[i - 1] : null,
    next: i >= 0 && i < pool.length - 1 ? pool[i + 1] : null,
  };
}
```

Create `apps/main-site/src/lib/article-tools.ts`:

```ts
// A Map, not an object literal: tags like "constructor" must not hit Object.prototype.
export const TAG_TOOL_MAP: ReadonlyMap<string, string> = new Map([
  ["authentication", "jwt-decoder"],
  ["api", "json-to-dart"],
  ["dart", "dart-data-class-generator"],
  ["ui", "color-generator"],
  ["widgets", "color-generator"],
]);

export function toolSlugForTags(tags: string[]): string | null {
  for (const tag of tags) {
    const slug = TAG_TOOL_MAP.get(tag.toLowerCase());
    if (slug) return slug;
  }
  return null;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `node --test tests/`
Expected: all test files pass.

- [ ] **Step 5: Components**

Create `apps/main-site/src/components/blog/ArticleHero.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { ShareButtons } from "@/components/blog/ShareButtons";
import type { Article } from "@/lib/articles";

export function ArticleHero({ post, postUrl }: { post: Article; postUrl: string }) {
  return (
    <header className="max-w-[1200px] mx-auto mb-10 pb-8 border-b border-border">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-faint mb-6 min-w-0">
        <Link href="/" className="hover:text-ink-muted transition-colors">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className="hover:text-ink-muted transition-colors">Blog</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink-muted truncate">{post.title}</span>
      </nav>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((t) => (
            <Link
              key={t}
              href={`/blog?tag=${encodeURIComponent(t)}`}
              className="font-mono text-[11px] px-2.5 py-1 rounded bg-accent/10 text-accent-light border border-accent/20 hover:bg-accent/20 transition-colors"
            >
              {t}
            </Link>
          ))}
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-ink mb-4 leading-[1.1] max-w-4xl">
        {post.title}
      </h1>
      {post.summary && (
        <p className="text-lg text-ink-muted leading-relaxed max-w-3xl mb-6">{post.summary}</p>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pt-5 border-t border-border/60">
        <div className="flex items-center gap-3">
          <Image src="/profile.png" alt="" width={44} height={44} className="rounded-full border border-border object-cover" />
          <div className="text-sm">
            <p className="font-semibold text-ink">{post.author ?? "Bilal Fali"}</p>
            <div className="flex items-center divide-x divide-border text-ink-faint">
              <time dateTime={post.publishedAt} className="pr-3">{formatDate(post.publishedAt)}</time>
              <span className="pl-3">{post.readingTime} min read</span>
            </div>
          </div>
        </div>
        <ShareButtons url={postUrl} title={post.title} />
      </div>
    </header>
  );
}
```

Create `apps/main-site/src/components/blog/ArticleSidebar.tsx`:

```tsx
import { TableOfContents } from "@/components/blog/TableOfContents";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { AdSlot } from "@bidev/ui";
import type { TocHeading } from "@/lib/toc";

export function ArticleSidebar({ headings }: { headings: TocHeading[] }) {
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col gap-6 lg:sticky lg:top-24 self-start">
      <TableOfContents headings={headings} />
      <div className="rounded-xl border border-border bg-bg-card p-4">
        <p className="font-mono text-xs text-teal mb-2">// newsletter</p>
        <h2 className="text-sm font-semibold text-ink mb-1">New Flutter articles by email</h2>
        <p className="text-xs text-ink-muted mb-3 leading-relaxed">New articles and tools, straight to your inbox.</p>
        <div className="[&_form]:flex-col [&_form]:items-stretch">
          <NewsletterForm />
        </div>
      </div>
      <AdSlot type="sidebar" />
    </aside>
  );
}
```

Create `apps/main-site/src/components/blog/AuthorBox.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { SOCIAL_LINKS } from "@/lib/site-links";

export function AuthorBox() {
  return (
    <section aria-labelledby="author-heading" className="rounded-xl border border-border bg-bg-card p-6 sm:p-8 flex flex-col sm:flex-row gap-5 sm:items-center">
      <Image src="/profile.png" alt="Bilal Fali" width={64} height={64} className="rounded-full border border-border object-cover shrink-0" />
      <div>
        <h2 id="author-heading" className="text-base font-semibold text-ink">Bilal Fali</h2>
        <p className="text-sm text-ink-muted mt-1 max-w-md leading-relaxed">
          Flutter developer. I build and ship Flutter apps and write down what I learn along the way.
        </p>
        <div className="flex flex-wrap gap-4 mt-3 text-sm">
          <Link href="/about" className="text-accent-light hover:text-ink transition-colors">About</Link>
          {SOCIAL_LINKS.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer" className="text-ink-muted hover:text-accent-light transition-colors">
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
```

Create `apps/main-site/src/components/blog/RelatedToolBanner.tsx`:

```tsx
import { Button } from "@/components/ui/Button";
import type { Tool } from "@/lib/tools";

export function RelatedToolBanner({ tool }: { tool: Tool }) {
  return (
    <div className="rounded-xl border border-accent/30 bg-gradient-to-r from-bg-card to-bg-elevated p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        <tool.icon className="w-8 h-8 text-accent shrink-0 mt-0.5" strokeWidth={1.75} />
        <div>
          <p className="font-mono text-xs text-teal mb-1">// related tool</p>
          <h3 className="text-base font-semibold text-ink">{tool.title}</h3>
          <p className="text-sm text-ink-muted mt-1 max-w-xl">{tool.description}</p>
        </div>
      </div>
      <Button href={tool.href} size="md" className="shrink-0">Open tool</Button>
    </div>
  );
}
```

Create `apps/main-site/src/components/blog/PrevNextArticles.tsx`:

```tsx
import Link from "next/link";

interface Neighbour {
  slug: string;
  title: string;
  summary: string;
}

export function PrevNextArticles({ prev, next }: { prev: Neighbour | null; next: Neighbour | null }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="More articles" className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {prev ? (
        <Link href={`/blog/${prev.slug}`} className="group block p-5 rounded-xl border border-border bg-bg-card hover:border-accent/50 transition-colors">
          <p className="font-mono text-[11px] text-ink-faint group-hover:text-accent-light mb-1 transition-colors">← previous article</p>
          <h3 className="text-base font-semibold text-ink mb-2">{prev.title}</h3>
          <p className="text-sm text-ink-muted line-clamp-2">{prev.summary}</p>
        </Link>
      ) : (
        <div className="hidden md:block" />
      )}
      {next && (
        <Link href={`/blog/${next.slug}`} className="group block p-5 rounded-xl border border-border bg-bg-card hover:border-accent/50 transition-colors md:text-right">
          <p className="font-mono text-[11px] text-ink-faint group-hover:text-accent-light mb-1 transition-colors">next article →</p>
          <h3 className="text-base font-semibold text-ink mb-2">{next.title}</h3>
          <p className="text-sm text-ink-muted line-clamp-2">{next.summary}</p>
        </Link>
      )}
    </nav>
  );
}
```

- [ ] **Step 6: Replace the article page body**

In `apps/main-site/src/app/blog/[slug]/page.tsx`:

1. Imports: remove `import { TableOfContents } ...` and `import { ShareButtons } ...`; change the articles import to `import { getAllArticleSlugs, getAllBlogArticles, getArticleBySlug, getRelatedArticles } from "@/lib/articles";`; add:

```tsx
import { ArticleHero } from "@/components/blog/ArticleHero";
import { ArticleSidebar } from "@/components/blog/ArticleSidebar";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { RelatedToolBanner } from "@/components/blog/RelatedToolBanner";
import { PrevNextArticles } from "@/components/blog/PrevNextArticles";
import { pickAdjacent } from "@/lib/adjacent";
import { toolSlugForTags } from "@/lib/article-tools";
import { TOOLS } from "@/lib/tools";
```

2. After `const related = await getRelatedArticles(post, 3);` add:

```tsx
  const { prev, next } = pickAdjacent(await getAllBlogArticles(), post.slug);
  const toolSlug = toolSlugForTags(post.tags);
  const relatedTool = toolSlug ? TOOLS.find((t) => t.slug === toolSlug) ?? null : null;
```

3. Replace everything from the line `return (` that follows the `if (post.isTroubleshooting) { ... }` block (the regular-article return) to the end of the function with:

```tsx
  return (
    <>
      <ReadingProgress />
      <ViewTracker slug={post.slug} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
        <ArticleHero post={post} postUrl={postUrl} />

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <ArticleSidebar headings={toc.headings} />

          <article className="w-full lg:max-w-[840px] min-w-0">
            {post.image && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 border border-border">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 840px"
                  className="object-cover"
                  priority
                  fetchPriority="high"
                />
              </div>
            )}

            <AdSlot type="banner" className="mb-10" />

            <ProseContent>
              {post.source === "db" ? (
                <div dangerouslySetInnerHTML={{ __html: toc.html }} />
              ) : (
                <MDXRemote source={post.content} options={mdxOptions} />
              )}
            </ProseContent>

            <AdSlot type="in-article" className="my-10" />

            {post.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-border">
                <p className="text-xs font-mono text-ink-faint mb-3">// tagged in</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/blog?tag=${encodeURIComponent(t)}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-bg-card border border-border text-ink-muted hover:border-accent/40 hover:text-accent-light transition-colors"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-6">
              <AuthorBox />
              {relatedTool && <RelatedToolBanner tool={relatedTool} />}
              <PrevNextArticles prev={prev} next={next} />
            </div>

            {related.length > 0 && <RelatedPosts posts={related} />}

            <ProductPromoBanner />
            <BuyMeCoffee variant="banner" />

            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-base font-semibold text-ink mb-6">Comments</h2>
              <Comments slug={post.slug} />
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
```

`Link` stays imported (tags footer). The troubleshooting branch above it is untouched.

- [ ] **Step 7: Verify**

`npx tsc --noEmit -p apps/main-site/tsconfig.json` (no output); `node --test apps/main-site/tests/` (all pass); build. In `apps/main-site/.next/server/app/blog/dart-flutter-mcp-server-explained.html` check: `// on this page` present; `// related tool` present only if the article has a mapped tag (this article is tagged `dart`, so the Dart Data Class Generator banner should appear); `next article` or `previous article` present when a same-category neighbour exists; `Bookmark` absent. Open an MDX-sourced article page and a troubleshooting page and confirm they still render (the troubleshooting layout is unchanged).

- [ ] **Step 8: Commit (only if the owner asked for commits)**

```bash
git add apps/main-site/src/lib/adjacent.ts apps/main-site/src/lib/article-tools.ts apps/main-site/tests apps/main-site/src/components/blog "apps/main-site/src/app/blog/[slug]/page.tsx"
git commit -m "feat(main-site): Stitch article layout with sidebar, author box, prev/next"
```

---

### Task 6: Whole-change verification

**Files:**
- Create: `apps/main-site/scripts/check-built-claims.mjs`

- [ ] **Step 1: Write the claims check**

Create `apps/main-site/scripts/check-built-claims.mjs`:

```js
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../.next/server/app/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

const FORBIDDEN = [
  "4,200", "Staff Mobile Architect", "Verified on Google Play", "Flutter 3.29",
  "48 articles", "0ms latency", "LATENCY", "ALL SYSTEMS OPERATIONAL", "System Status",
  "SaaS Mobile Starter Kit", "Clean Architecture Template", "every Tuesday", "Bookmark",
];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".html") ? [p] : [];
  });
}

const files = walk(root);
let failed = 0;
for (const file of files) {
  const html = readFileSync(file, "utf8");
  for (const phrase of FORBIDDEN) {
    if (html.includes(phrase)) {
      console.error(`FAIL  "${phrase}" in ${file}`);
      failed++;
    }
  }
}

const must = (file, text) => {
  const html = readFileSync(join(root, file), "utf8");
  if (!html.includes(text)) {
    console.error(`FAIL  ${file} is missing "${text}"`);
    failed++;
  }
};
must("index.html", 'id="newsletter"');
must("blog/dart-flutter-mcp-server-explained.html", "// on this page");

console.log(`${files.length} pages checked`);
if (failed) process.exit(1);
console.log("OK");
```

- [ ] **Step 2: Run everything**

From repo root, after a fresh build (`npm run build --workspace=apps/main-site`):
- `node apps/main-site/scripts/check-contrast.mjs` (all PASS)
- `node --test apps/main-site/tests/` (all pass)
- `node apps/main-site/scripts/check-built-claims.mjs` (prints `OK`)
- `npx tsc --noEmit -p apps/main-site/tsconfig.json` (no output)
- `npm run build --workspace=apps/tech-blog` (still builds; it must not depend on anything changed)

- [ ] **Step 3: Manual visual check**

With `npm run dev --workspace=apps/main-site`, view the homepage and one database article at 375px and 1440px. Confirm: no horizontal scroll; the bottom tab bar never hides footer links or the last paragraph; keyboard Tab shows a visible focus ring on header links, tab bar items, and the Subscribe button; with the OS "reduce motion" setting on, no animation plays; the table of contents highlights the section in view; prev/next appear only when a neighbour exists. If no browser is available to you, say so explicitly instead of claiming this was checked.

- [ ] **Step 4: Clean up**

Leave `newcodeui.jsx` in place unless the owner asks to delete it. Do not commit `scratchpad/`.

- [ ] **Step 5: Commit (only if the owner asked for commits)**

```bash
git add apps/main-site/scripts/check-built-claims.mjs
git commit -m "chore(main-site): guard script for forbidden claims in built pages"
```
