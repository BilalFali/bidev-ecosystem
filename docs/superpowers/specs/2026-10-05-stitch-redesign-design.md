# Stitch redesign for bidev.dev (main-site): homepage, article page, shared chrome

## Goal

Apply the Stitch mockup in `newcodeui.jsx` (article page, homepage desktop, homepage mobile) to `apps/main-site` using real site data only. Success: the homepage, article page, Header and Footer match the mockup's look and structure; every piece of content shown is true; no other app (`tech-blog`, `admin`, `portfolio`) changes.

## Decisions already made with the owner

- Scope: homepage and article page templates, plus the shared Header and Footer redesigned for the whole site. Other pages keep their layouts and inherit the new colors and fonts automatically.
- Approach A: change token values in `apps/main-site/tailwind.config.ts`. No second token system, no Tailwind CDN, no literal HTML port.
- Typeface: follow the mockup (Inter for text, JetBrains Mono for code, badges and labels). This replaces Space Grotesk in main-site only.

## Hard rule: no fabricated content

The mockup is placeholder copy. The following must not ship:

| Mockup claim | Replacement |
| --- | --- |
| "4,200+ elite engineers" | No subscriber count |
| "Staff Mobile Architect", "Solo Flutter architect" | "Flutter developer" |
| "Verified on Google Play" on the author | Omit, or "8 apps live on Google Play" (true per portfolio data) |
| "Updated for Flutter 3.29", "Flutter 3.29 Compatible" | Omit |
| "View all 48 articles" | Real published count, computed |
| "0ms latency", "Zero latency" | Omit |
| "LATENCY / REGION / ALL SYSTEMS OPERATIONAL / System Status" | Remove |
| Products "$49 SaaS Mobile Starter Kit", "$29 Clean Architecture Template" | Real products from the database (currently one: Flutter Firebase Kit) |
| "One tip every Tuesday" | No cadence promise |
| Bookmark button | Remove (no backend) |
| Mock article "Offline-First with Riverpod and Drift", mock prev/next | Real articles |
| "RSS Feed" link | Only if a real feed route exists, otherwise omit |

## 1. Design tokens (`apps/main-site/tailwind.config.ts`)

Override values for the existing semantic names so every current component re-themes without edits:

- `bg.DEFAULT #0f131d`, `bg.secondary #0a0e18`, `bg.card #1c1f2a`, `bg.elevated #262a35`, `bg.elevated2 #313540`
- `border.DEFAULT #424754`, `border.strong #8c909f`
- `accent.DEFAULT #4d8eff`, `accent.light #adc6ff`, `accent.strong #001a42` (text on the accent fill), `accent.hover #6ba0ff`. The mockup's own on-primary `#002e6a` measures 4.15:1 on `#4d8eff`, below WCAG AA, and white measures 3.17:1, so the darker `#001a42` (5.40:1) is used and hover gets lighter rather than darker so the contrast holds.
- `ink.DEFAULT #dfe2f1`, `ink.muted #c2c6d6`, `ink.faint #8c909f`
- New names: `teal.DEFAULT #4fdbc8` (success and "live" signals, secondary accent), `tertiary.DEFAULT #ffb786` (tertiary accent)
- The existing `signal` amber token stays for "new/updated" state.
- Fonts: `sans` maps to Inter via `next/font`, `mono` stays JetBrains Mono. Remove Space Grotesk from `layout.tsx`.
- Radii: default 0.25rem, `lg` 0.5rem, `xl` 0.75rem (the mockup's scale). Existing `rounded-xl` cards already match.

Risk: a color shift on every page. Mitigation: verify contrast of `ink.faint` on `bg` meets WCAG AA for body-size text; adjust the single token if not.

## 2. Header (`components/layout/Header.tsx`)

- Sticky, `bg/80` with backdrop blur, bottom hairline, max width 1440, height 64.
- Left: logo mark plus "BiDev"; desktop nav keeps the real routes (Home is dropped in favor of the logo; Articles, Learn, Troubleshooting, Tools, AI, Interview). Active link: accent text with 2px underline.
- Right: the existing inline search (⌘K already focuses it; there is no command palette on this site) and a Subscribe button linking to `/#newsletter`, hidden below `sm`.
- Mobile: a fixed bottom tab bar as in the mobile mockup (Home, Tools, Articles, Interview, Search), shown below `md`. The top hamburger stays and lists every route. The bar's Search tab opens the same inline search. Bottom padding is added to the page so the bar never covers content or the footer.

## 3. Footer (`components/layout/Footer.tsx`)

Restyle only. Keep the existing real link set (it already includes `/feed.xml` and `/sitemap.xml`, which help crawling). Add the logo mark, mono column headings (already used), and replace the `$ echo` copyright line with a plain computed-year line. No status badge, no latency or region text.

## 4. Homepage (`app/page.tsx`)

Sections, in order, each fed by real data:

1. **Hero.** Left: pill badge "Built for Flutter developers", headline "Flutter knowledge from real production apps" with the gradient phrase, one-sentence subline, two CTAs (Browse Tools, Read Articles). Right: the JSON to Dart preview window. It is a static illustration of the real `/tools/json-to-dart` tool, links to it, and carries no performance claims.
2. **Trust strip.** Three true statements: built by Bilal (Flutter developer), apps live on Google Play (count from portfolio data, currently 8), free tools that run in your browser.
3. **Featured tools** (bento). Two large cards (JSON to Dart, Dart Data Class Generator) and four small cards (JWT Decoder, Color Generator, Regex Tester, QR Generator), from `lib/tools.ts`. Mini previews are decorative and make no claims.
4. **Latest articles.** Three large cards from the database, then a compact list. Link text uses the real total.
5. **Learn Flutter, Solve a problem, Resources hub** (existing sections): kept and restyled through tokens plus the mockup's mono eyebrow above each section title, because they link the learning hub and troubleshooting, which matter for site structure.
6. **Interview prep.** Highlight panel with real category chips and the real question count (78).
7. **Browse by topic.** Chips from the most-used real tags (computed from published articles), linking to `/blog?tag=`.
8. **Products.** Real products only; if there is one, render one card.
9. **Newsletter.** Uses the existing `NewsletterForm` and `/api/newsletter`. Copy makes no cadence or count claim.

The existing AdSense slots keep their current gating (`NEXT_PUBLIC_ADS_ENABLED`) and are not added to new places.

## 5. Article page (`app/blog/[slug]/page.tsx` and `TroubleshootingArticle`)

- Breadcrumb in the header: Articles / category / title.
- Hero block: tag chips from real tags (mono badge style), H1, excerpt as lead paragraph, author row (Bilal, date, reading time), Copy link and Share (reuse `ShareButtons`).
- Two-column reading layout on `lg` and up: left sticky 260px sidebar, article body max 840px.
  - Sidebar "On this page": **an existing `TableOfContents` component already exists but renders nothing for database articles** (verified on the live site: no `// contents` block and no `id` on any `<h2>`, because it parses Markdown `##` and the content is HTML). Fix: a pure `addHeadingIds(html)` function extracts `<h2>`/`<h3>` and injects unique `id`s; MDX articles keep Markdown extraction. Active-item highlighting already exists. Hidden when fewer than 3 headings.
  - Sidebar newsletter widget using `NewsletterForm`, no counts. The sidebar ad slot moves under it.
- Body keeps `ProseContent`. Code-copy buttons already exist there, so code blocks are restyled via tokens only (no window bar).
- Author box with real bio and links (GitHub, LinkedIn, YouTube from existing site config).
- Related tool banner, shown only when a small explicit tag-to-tool map matches one of the article's tags (for example `authentication` to JWT Decoder). No match, no banner.
- Previous and next article: the neighbors by published date within the same category; omitted at the ends.
- Troubleshooting articles (`TroubleshootingArticle`) keep their structure and only inherit the new tokens.
- JSON-LD, breadcrumbs, canonical and metadata are untouched.

## 6. Out of scope

Dark and light theme switching (site stays dark), redesign of `/blog` listing, tools, interview, jobs, products pages beyond inherited colors, `tech-blog`, `admin`, `portfolio`, any ad changes, any content or database changes.

## Testing and verification

- `tsc --noEmit` and `next build` for main-site must pass.
- Grep the built HTML for each removed claim from the table above; none may appear.
- Spot-check built HTML: homepage contains the real article count and the real product; a database article's HTML contains the `// contents` block and every listed heading id exists in the body.
- Unit-check the pure helpers (`addHeadingIds`, `extractMarkdownHeadings`, `pickAdjacent`, `toolSlugForTags`) with `node --test` (main-site has no test framework; Node 24 runs the TypeScript helper files directly, so no dependency is added).
- Contrast check: a script asserts WCAG AA (4.5:1) for `ink`, `ink-muted`, `ink-faint`, and `accent` text on `bg` and `bg-card`, and for `accent-strong` text on the `accent` button fill.
- Visual check at 375px and 1440px for homepage and one article: no horizontal scroll, bottom bar does not cover content, focus rings visible, `prefers-reduced-motion` respected.
- Confirm `tech-blog` still builds (it must not import anything changed).

## Delivery order (for the implementation plan)

1. Tokens and fonts. 2. Header and Footer. 3. Homepage. 4. Article page (TOC, code-copy, author box, prev/next). 5. Verification and cleanup of `newcodeui.jsx` (keep or delete as the owner prefers).
