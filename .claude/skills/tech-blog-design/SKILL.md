---
name: tech-blog-design
description: Complete editorial design system and visual philosophy for BiDev Tech (tech.bidev.dev) — a premium technology magazine covering AI, hardware, big tech, security, gaming, and science. Load this whenever creating, redesigning, or modifying any UI for tech.bidev.dev, or when writing new components/pages for that property. Not a color palette — a full design language covering typography, layout, components, motion, data visualization, and editorial voice.
---

# BiDev Tech — Editorial Design System

## Identity

BiDev Tech is a **premium technology magazine**, not a SaaS product, not a developer portfolio, not a blog theme. Every screen should read as if a professional editorial design team — the kind that ships a real newsroom's digital product — built it with a real budget and real taste.

Brand personality: **intelligent, modern, credible, curious, fast, technical, editorial, premium, global.**

Before implementing any UI on this site, ask: *"What would make this look like a real technology publication designed by a professional editorial design team?"* Never settle for the first obvious layout. If a layout looks like it came from a component library's default demo, it's wrong.

### Explicitly forbidden aesthetics

Do not produce, and actively steer away from:
- Generic SaaS landing pages (giant centered hero, gradient blob background, "Get Started Free" energy)
- Developer-dashboard UI (sidebar + cards + stat tiles everywhere)
- Typical WordPress blog layouts
- Medium-clone or TechCrunch-clone layouts
- Excessive glassmorphism, frosted panels, blur-everything
- Excessive rounded corners on every surface
- Purple/violet gradient "startup" UI
- Generic Inter/Roboto/Arial/Space Grotesk typography
- Huge, mostly-empty hero sections with no real content
- Identical card grids repeated for every section (3-up card grid as the answer to everything)
- Rainbow-colored category pills with no restraint

If a proposed layout matches any of the above, redesign it before shipping.

## Typography

Typography carries the editorial weight of this site — it is the single most important design decision. Do not reach for Inter, Roboto, Arial, or Space Grotesk.

**Display / Headlines — Fraunces** (variable serif, `wght` 300–900, `opsz` axis available). Fraunces gives headlines real editorial gravitas and a point of view without being a tired choice like Playfair Display. Use it for: hero headline, article H1, section headers, pull quotes.

**Body / UI — IBM Plex Sans**. Clean, engineered, technically credible without being cold. Use it for: body copy, navigation, buttons, metadata, captions, forms.

**Data / Mono — IBM Plex Mono**. Reserved for numerals in data callouts, stat cards, timestamps in dense lists, and any code snippet. Gives the "Data" section and technical content a precise, instrument-panel feel that reinforces credibility.

Load via `next/font/google` (self-hosted, zero layout shift) — never a runtime Google Fonts `<link>`.

```css
--font-display: "Fraunces", ui-serif, Georgia, serif;
--font-body: "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif;
--font-mono: "IBM Plex Mono", ui-monospace, "SF Mono", monospace;
```

### Type scale (fluid, `clamp()`-based — not fixed breakpoints)

```css
--text-eyebrow:  0.6875rem;                              /* 11px, letter-spacing .08em, uppercase, Plex Sans SemiBold */
--text-dek:      clamp(1.0625rem, 0.98rem + 0.4vw, 1.25rem);   /* article summary / subheadline */
--text-body:     1.0625rem;                               /* 17px — never below this for reading copy */
--text-caption:  0.8125rem;                                /* 13px — metadata, captions */
--text-meta:     0.75rem;                                  /* 12px — timestamps in dense lists */

--text-h1-article: clamp(2rem, 1.6rem + 2vw, 3.5rem);       /* Fraunces, wght 480–560 */
--text-h1-hero:     clamp(2.25rem, 1.6rem + 3vw, 4.25rem);  /* dominant homepage story */
--text-h2:          clamp(1.5rem, 1.3rem + 1vw, 2rem);
--text-h3:          clamp(1.125rem, 1.05rem + 0.4vw, 1.375rem);
--text-card-title:  1.0625rem;                              /* compact list card headline */
```

### Editorial component hierarchy (use on every article-referencing surface)

```
Eyebrow    →  category label, small caps, accent-colored, links to category page
Headline   →  Fraunces, the actual title, never truncated with ellipsis on the article page itself
Dek        →  one-sentence summary in IBM Plex Sans, ink-muted, larger than body text
Metadata   →  author · date · reading time, in Plex Sans caption size, ink-faint
```

Never skip the eyebrow on a card or article — category identity is core to how a magazine reader orients themselves.

## Color System

Warm, print-inspired neutrals — not stark white, not pure black. One disciplined accent used sparingly, plus a small, deliberately muted category-color set (never a rainbow).

```css
:root {
  /* Paper & ink — warm neutrals, not clinical */
  --paper:        #FAF8F4;
  --paper-raised: #FFFFFF;
  --paper-sunken: #F1EEE7;
  --ink:          #17140F;
  --ink-muted:    #4A453C;
  --ink-faint:    #8A8375;
  --border:       #E4DFD3;
  --border-strong:#CFC8B6;

  /* Accent — signal, used for CTAs, active states, breaking-news, links in flow */
  --accent:       #D4380D;   /* signal red-orange — urgency + editorial "wire" feel, not SaaS blue/purple */
  --accent-hover: #B32E09;
  --accent-tint:  #FBE7DF;

  /* Data / secondary accent — reserved for charts, stat callouts, data links */
  --data:         #0F6E5C;   /* deep teal-emerald — precise, technical, distinct from --accent */
  --data-tint:    #E1F0EC;

  /* Category colors — muted, desaturated, used ONLY as small eyebrow text/underline, never large fills */
  --cat-ai:        #6B4FA0;
  --cat-security:  #B0231C;
  --cat-hardware:  #55606B;
  --cat-bigtech:   #2E5A8C;
  --cat-gaming:    #2F7D4F;
  --cat-startups:  #A05A2C;
  --cat-science:   #3F7C82;
}

[data-theme="dark"], :root:not([data-theme="light"]) {
  @media (prefers-color-scheme: dark) {
    --paper: #100E0A; --paper-raised:#17140F; --paper-sunken:#1C1812;
    --ink:#F2EEE4; --ink-muted:#B8B1A0; --ink-faint:#736C5D;
    --border:#2B2620; --border-strong:#3D362B;
    --accent:#FF6B3D; --accent-hover:#FF8259; --accent-tint:#3A2013;
    --data:#3FBFA0; --data-tint:#12332B;
  }
}
```

Rules:
- The accent color (`--accent`) is used for: category eyebrows on the hero story only, primary CTA buttons, active nav state, the breaking-news rail, and links inside body copy. It should never cover a large surface area (no accent-colored hero backgrounds, no accent buttons filling a whole card).
- `--data` is reserved exclusively for charts, stat cards, and the Data section — this separation is what makes the data storytelling feel distinct and intentional rather than decorative.
- Category colors appear only as: eyebrow text color, a 2px underline accent, or a small dot — never as a card background fill.

## Spacing, Borders, Radius, Shadow

Editorial layouts run on **rhythm and rules (hairline dividers)**, not shadows and rounded cards.

```css
--space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
--space-5: 1.5rem;  --space-6: 2rem;   --space-8: 3rem;    --space-10: 4rem;
--space-12: 6rem;   --space-16: 8rem;  /* section rhythm on desktop */

--radius-none: 0px;
--radius-sm:   2px;   /* default for cards, buttons, tags — sharp, editorial */
--radius-md:   4px;   /* reserved for images/thumbnails only */
--radius-full: 999px; /* reserved for pill-shaped filter/tag toggles only */

--border-hairline: 1px solid var(--border);
--border-strong:   1px solid var(--border-strong);

--shadow-none: none;
--shadow-card: 0 1px 2px rgba(23,20,15,0.04);       /* barely-there lift, not a floating-card effect */
--shadow-elevated: 0 4px 16px rgba(23,20,15,0.08);   /* modals, dropdowns only */
```

Rules:
- **Default radius across the entire site is 2px or 0px.** Large rounded corners (8px+) read as "SaaS card," which this brand must avoid. The only exception is thumbnail images (`--radius-md`) and pill-shaped filter chips.
- Prefer a 1px hairline border or a bottom-rule divider over a shadow to separate content. Shadows are reserved for genuinely floating UI (dropdowns, modals, sticky search overlay).
- Section boundaries on the homepage are marked with a `--border-hairline` top rule and a `--text-eyebrow`-style section label, not a background-color change or a card wrapper around the whole section.

## Iconography

Use **Lucide** (already the icon system used elsewhere in this codebase — stay consistent) at `strokeWidth={1.5}`, sized small (16–20px) and used sparingly: navigation, share controls, category-page filters, data-card trend arrows. Icons support the UI; they are never decorative filler next to every headline.

## Images

Photography is a primary storytelling tool here, not decoration.

- Fixed aspect ratios per context, never "whatever the source image is": hero `16:9` or `3:2` on desktop, `4:3` on mobile hero; list-card thumbnails `4:3`; author avatars circular 32–40px only.
- `--radius-md` (4px) on thumbnails, `--radius-none` on the dominant hero image — a full-bleed or near-full-bleed hero image should not be trapped in a rounded rectangle.
- Consistent, restrained cropping (subject-focused, not stretched). Use `next/image` with `sizes` tuned per breakpoint, `priority` only on the hero image, everything else lazy-loaded.
- Hover treatment on article cards: a subtle `scale(1.02)` on the image only (not the whole card), 200–300ms ease, plus the headline shifting to `--accent` — no shadow pop, no border glow.
- Never wrap every image in a card frame. A large editorial image in the hero or inside an article body should bleed toward the edge of its column, not sit inside a bordered box.

## Article Cards & News List Density

Not every story is a big card. A real magazine front page mixes scales deliberately.

**Three card sizes, used intentionally:**
1. **Dominant story** (1 per page/section) — large image, `--text-h1-hero` or `--text-h2` headline, dek visible, full metadata.
2. **Standard card** — image + eyebrow + `--text-card-title` headline, no dek, compact metadata.
3. **Compact list row** (Latest News, Trending) — no image or a small 64–80px square thumbnail, eyebrow + headline + timestamp only, separated by hairline rules, not individual card borders. This is where "information density" comes from — a real tech publication's "Latest" rail is a dense scannable list, not a repeated card grid.

Never render an entire section (e.g. "Latest News") as identical medium cards — that is the single most common way this ends up looking generic. Mix a compact list with occasional larger cards for emphasis.

## Breaking / Freshness Treatment

- A "Breaking" label is a small, solid `--accent` background tag with white text, `--text-meta` size, uppercase, used only for genuinely time-sensitive stories — never as decoration.
- Timestamps use relative time under 24h ("2h ago"), absolute date beyond that ("Aug 12"). Always in `--font-mono` at `--text-meta` size in dense lists — the monospace treatment is what makes timestamps feel like a real wire service rather than a blog date stamp.
- Do not badge every card as "New" — reserve freshness signaling for the Latest News rail and the hero.

## Data Visualization

Data is a stated differentiator — treat it as its own visual language, not an afterthought chart plugin.

- All charts use `--data` (teal) as the primary series color, `--ink-faint` for gridlines/axes, `--font-mono` for all numeric labels and axis ticks.
- No 3D effects, no heavy drop shadows on chart elements, no default charting-library color palettes (no default blue/orange/green rainbow series — if multiple series are needed, use tints/shades of `--data` plus `--ink-muted`, not arbitrary hues).
- Stat callouts ("DataCard") pair one large `--font-mono` numeral with a short Plex Sans label underneath and an optional small trend arrow (Lucide `ArrowUp`/`ArrowDown` in `--data` or `--accent` depending on whether the trend is framed positively or as a warning) — modeled on a print-magazine "by the numbers" sidebar, not a dashboard KPI tile.
- Rankings/leaderboards use a numbered list with a hairline-divided row per entry, not a bar-chart-as-card grid.
- Comparison tables (X vs Y) use a real `<table>` with a sticky header row, generous row padding, and `--border-hairline` row dividers — never a card-per-product grid pretending to be a comparison.

Refer to the `dataviz` skill for the general charting/color methodology and apply the `--data` token in place of that skill's placeholder accent.

## Layout & Homepage Structure

Mobile-first, but the desktop composition should feel like a real front page with unequal column widths and deliberate emphasis — not a symmetric grid.

**Header**: logo (wordmark, Fraunces) — primary category nav (horizontal, Plex Sans, active state = `--accent` underline, not a filled pill) — search (icon that expands to an inline overlay, not a separate page by default) — theme toggle — hamburger only below `md`.

**Top News**: one dominant story (large image, hero headline, dek, full metadata) beside 3–4 supporting stories in compact form (image optional, headline + eyebrow + timestamp) — asymmetric split (e.g. 60/40 or 2/3-1/3 desktop columns), never four equal-sized cards in a row.

**Latest News**: dense chronological list, hairline-divided rows, small square thumbnails, timestamp in mono.

**AI / Mobile & Hardware / Big Tech**: each gets its own section with a `SectionHeader` (eyebrow + "View all" link + hairline rule), then a mixed-density layout (one standard card + a compact list, per the card-density rule above) — do not reuse the exact same 3-column grid for every section; vary the composition per section so the page has genuine editorial rhythm as you scroll.

**Data section**: 2–4 `DataCard`s plus one editorial chart, framed with its own section header, visually distinct via the `--data` accent so it reads as "the numbers section" at a glance.

**Explainers / Comparisons**: horizontally-scrollable or 2-column card treatment with a distinct visual texture (e.g. a subtle `--paper-sunken` background band for the whole section) so they read as a different content *type*, not more news cards.

**Trending**: numbered compact list (1–5), no images, pure headline density — echoes a print "most read" sidebar.

**Newsletter**: a quiet, confident band — headline + one-line pitch + email input + button, `--paper-sunken` background, no illustration, no gradient.

**Footer**: category index, company/about, social, legal — dense multi-column, small type, clearly de-emphasized relative to content above it.

## Article Page

The reading experience is the product. Protect it.

Structure top to bottom: breadcrumbs (small, `--ink-faint`) → eyebrow category → Fraunces H1 → dek → author/date/updated/reading-time metadata row → hero image (near-full-bleed, `--radius-none`) → optional table of contents (sticky, collapsible, on desktop only, in the margin — never inline blocking the lede) → body copy at a comfortable measure (`max-width: 68ch`, `--text-body`, line-height 1.7) → pull quotes (large Fraunces italic, left border in `--accent`, no background fill) → inline images/data visualizations sized to the content column, occasionally breaking wider than the text column for emphasis → code blocks (`--font-mono`, `--paper-sunken` background, hairline border, no rounded-pill "language" badge — a small mono label instead) → author bio card (compact, photo + one-line bio) → related stories (3, compact-card format) → share controls (icon row, `--ink-muted`, hover to `--ink`) → newsletter CTA (same quiet treatment as homepage).

Do not interrupt the body copy with promotional cards, "you might also like" grids mid-article, or more than the standard ad slots. The reading column stays visually calm.

## Advertising

Ads must never be mistaken for navigation, downloads, tools, or editorial recommendations — this is a hard rule, not a style preference (the main bidev.dev property has already had an AdSense policy violation over exactly this; do not repeat it here).

- Every ad slot carries a visible, non-decorative "Advertisement" label (`--text-meta`, `--ink-faint`, uppercase) directly above it — always, no exceptions.
- Ad slots sit in their own visually distinct band: `--paper-sunken` background or a hairline top+bottom rule, clearly separated by real spacing (`--space-8`+) from adjacent navigation, category rails, or CTA buttons.
- Never place an ad directly beside or between a breadcrumb/nav rail, a "read more" link cluster, or a tool/download button. Never style an ad container with the same visual treatment as an `ArticleCard` or a `Button`.
- Editorial content is always visually dominant on the page — ads are secondary in size and visual weight, never full-bleed hero-sized on a content page.

## Motion

Subtle and fast. Motion should feel like a well-built product, not a portfolio piece.

Allowed: image hover scale (`~1.02`, 200–300ms), headline color transition on card hover, underline-draw on nav active state, a gentle scroll-reveal fade-up for section entrances (`opacity`/`translateY(8px)`, ~400ms, triggered once), a smooth expand for the search overlay, subtle skeleton-loading shimmer for async content.

Forbidden: bouncing/spring physics for anything other than a toggle switch, page-transition wipes/slides, parallax hero effects, auto-playing carousels, any animation longer than ~400ms for a UI response.

Always respect `prefers-reduced-motion: reduce` — disable non-essential transitions and reveal animations entirely (not just shorten them) when set.

## Responsive Rules

Mobile is not "desktop stacked." Recompose deliberately:

- **Mobile**: single column, large readable headlines (Fraunces still used, sized down via the fluid scale — never swap to a smaller sans for mobile headlines), the dominant-story hero becomes full-width with the image above the text, supporting stories collapse into the compact-list treatment (not stacked full cards), category nav becomes a horizontally-scrollable chip rail beneath the header rather than a hamburger-only menu (news readers expect to see categories, not hunt for them), comfortable content padding (`--space-4` to `--space-5` side margins), no horizontal scroll anywhere except the intentional category-chip rail and any explicit horizontal card rail.
- **Tablet**: a controlled 2-column grid for card sections, hero story keeps its asymmetric split but at reduced ratio (e.g. 55/45).
- **Desktop**: full asymmetric editorial grid as described in Homepage Structure, sticky table-of-contents in the article margin, multi-column footer.

## Accessibility

- Minimum contrast: body text 4.5:1, large headline text 3:1, verified against both light and dark token sets above.
- Every interactive element has a visible focus ring (`outline: 2px solid var(--accent); outline-offset: 2px;` — never `outline: none` without a replacement).
- Full keyboard navigation for nav, search overlay (focus trap while open, `Escape` closes it, focus returns to the trigger), and any filter/tab controls.
- Semantic HTML always: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>` for ToC/related-content rails, real heading hierarchy (one `<h1>` per article, no skipped levels).
- All images carry meaningful `alt` text authored per image — never the article title reused as alt text for every image in the piece.
- Respect `prefers-reduced-motion` as specified above.

## SEO

The visual system must never compromise these:
- One clear `<h1>` per article page, matching the visible headline exactly.
- Breadcrumbs present and marked up with `BreadcrumbList` structured data.
- Category and tag pages are real, crawlable, internally-linked pages — not client-side-only filters with no distinct URL.
- Related-articles and "internal linking" blocks link to real, existing content only.
- Author name, publish date, and updated date are visible in the rendered HTML (not injected client-side only) and paired with `Article`/`NewsArticle` structured data.
- Reading width and hierarchy choices above (68ch measure, real heading levels) double as good SEO practice — don't sacrifice them for a "cleverer" layout.

## Performance

- CSS custom properties for all tokens above; no CSS-in-JS runtime for static design tokens.
- `next/font` for Fraunces, IBM Plex Sans, and IBM Plex Mono — self-hosted, `display: "optional"` or `"swap"` as appropriate, no external font `<link>` requests.
- `next/image` everywhere, real `sizes`, `priority` only on the single above-the-fold hero image per page.
- Motion via CSS transitions/`@keyframes` first; reach for a JS animation library only if CSS genuinely cannot express the interaction — do not add a library for a single hover effect.
- Prefer Server Components for anything that doesn't need interactivity (article body, card grids, footer); mark only genuinely interactive pieces (search overlay, theme toggle, filter chips, newsletter form) as Client Components.
- Lazy-load below-the-fold images and non-critical sections (Explainers, Trending rail) where the framework supports it naturally.

## Component Inventory

Build these as reusable, composable pieces — not over-engineered with props for hypothetical future needs:

`ArticleCard` (accepts a `size` variant: `dominant | standard | compact`) · `FeaturedStory` · `NewsList` (renders compact rows) · `CategoryHeader` · `SectionHeader` (eyebrow + title + "View all" link + hairline rule) · `TrendingList` (numbered) · `AuthorMeta` · `ArticleHero` · `RelatedStories` · `NewsletterCard` · `SearchBox` (expanding overlay) · `DataCard` · `Chart` (thin wrapper enforcing the `--data` token and mono labels) · `Tag` · `Breadcrumbs` · `ShareButtons` · `BreakingBadge`.

One `ArticleCard` with a size variant, not three near-duplicate card components — but don't collapse `ArticleCard` and `NewsList` into one over-abstracted component either; they render different information density and deserve to stay separate.

## Working on This Project

1. **Inspect before changing.** Before any redesign or new page, read the existing implementation for that area, identify which tokens/components already exist, and reuse them rather than inventing parallel ones.
2. **Preserve what must be preserved**: existing URLs, existing SEO metadata, existing working functionality, existing content. A visual upgrade is not a license to restructure routes or rewrite working data-fetching logic.
3. **Every new page must feel like the same publication.** If a new section doesn't obviously belong next to the homepage and article page built from this system, it's wrong — go back to the tokens and hierarchy rules above.
4. **When in doubt between "safe and generic" and "distinctive and editorial," choose editorial** — but never at the cost of accessibility, performance, or SEO fundamentals above.

The result should read as **"premium technology publication."** If it reads as **"AI-generated SaaS website,"** it has failed this skill's brief — stop and redesign.
