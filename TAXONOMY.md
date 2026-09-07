# BiDev Tech — Content Taxonomy & Information Architecture

Strategy/research only — no code, database, or URLs have been touched. This builds on `STRATEGY.md` and `DESIGN.md`.

---

## 1. Taxonomy Philosophy

Before designing anything, these terms need distinct, non-overlapping jobs. Using them loosely is the #1 cause of messy taxonomies at scale.

| Term | Definition | Does BiDev Tech need it? |
|---|---|---|
| **Category** | A top-level topic silo. Owns a primary nav slot and a landing page. Small, fixed set (~9–11). | Yes — the backbone of the site. |
| **Section** | A sub-topic inside a category. Groups articles for browsing once a category has volume. Not in main nav; lives on the category page. | Yes, but only where volume justifies it. |
| **Subcategory** | Same concept as Section — we use one term (Section) to avoid a duplicate, redundant layer. | No — merged into Section. |
| **Content Type** | The *format* of a piece (News, Review, Comparison, Guide...), independent of topic. A Comparison can exist in AI, Mobile, or Hardware. | Yes — critical, and must stay separate from Category (see §4). |
| **Tag** | A lightweight, non-hierarchical label for filtering/discovery (a company, product, technology, or attribute). No guarantee of its own page. | Yes, but curated — not free-form. |
| **Entity** | A *specific* tag (a company or product) important enough to earn a dedicated, evergreen hub page that aggregates all coverage of it. | Yes, for a limited, high-value set (see §6). |
| **Topic** | Loosely used term people conflate with Category/Tag. We don't use it as a distinct taxonomy node — everything that would be a "topic" is either a Category, Section, or Tag. | No — deliberately not a separate node. |
| **Series** | An editorially curated, ordered sequence of pieces (e.g. a multi-part investigation, a recurring weekly column). Manually curated, small in number. | Yes, but as a lightweight, optional editorial feature — not part of the core hierarchy. |

**Rule of thumb:** Category and Section answer *"what is this about, broadly?"* Content Type answers *"what kind of piece is this?"* Tags/Entities answer *"who and what specifically does this mention?"* These are three independent facets applied to every article — never merged into one hierarchy.

---

## 2. Category System (Top-Level)

Ten top-level categories, down from the ~17 raw ideas in the brief. Several original ideas (Apps, Internet, Cloud, Startups) are folded in as Sections rather than given their own nav slot — at realistic volume they wouldn't sustain a standalone category page early on, and splitting them dilutes topical authority instead of building it.

| Category | Purpose | Audience | SEO potential | Top-level? |
|---|---|---|---|---|
| **AI** | Core growth topic | Broad + technical | Very high | Yes |
| **Mobile** | Smartphones, wearables, mobile OS | Buyers + enthusiasts | Very high | Yes |
| **Hardware** | Laptops, PCs, components, peripherals | Buyers + enthusiasts | Very high | Yes |
| **Software** | Apps, OS, internet, cloud, open source | General + technical | High | Yes |
| **Big Tech** | Company-level coverage of major players | Industry watchers | High | Yes |
| **Data** | Market data, statistics, trackers | All (differentiator, §STRATEGY §10) | High (linkable) | Yes |
| **Security** | Cybersecurity, privacy | All | Medium-high | Yes |
| **Business** | Startups, funding, VC, M&A, industry trends | Founders, investors | Medium | Yes |
| **Gaming** | Console/PC/mobile gaming, game industry | Broad | High | Yes |
| **Future Tech & Science** | Space, robotics, quantum, biotech, climate tech | Curious readers | Medium | Yes |

**Not top-level (why):**
- **Startups** → folded into **Business** as a section. Standalone, it competes for the same "company news" reader as Big Tech without enough distinct daily volume to earn its own nav slot early on.
- **Apps, Internet, Cloud** → folded into **Software** as sections. Each is too thin alone at launch volume; together they form one coherent, useful category.
- **News** is explicitly **not a category** — see §8. It's a cross-cutting content type/filtered stream, not a topic silo.
- **Developer Technology** (Flutter/Dart/Firebase, the legacy bidev.dev content) → **FUTURE/OPTIONAL**, not part of tech.bidev.dev's core ten. Recommend keeping it on the existing bidev.dev domain/subdomain and cross-linking, rather than diluting the new tech-media identity with developer-tutorial content. Revisit only if there's a strategic reason to merge audiences.

---

## 3. Sections per Category

Sections are only created where they'll sustain real volume — over-splitting (e.g. separate sections for CPUs, GPUs, Storage, Monitors) creates empty-looking pages at low article counts and gets *merged back* once the site scales, which is wasted rework. Better to start merged and split later only if a section provably outgrows its parent.

**AI**
- AI Models · AI Tools · AI Agents · Generative AI · AI Coding · AI Research
- *(AI Business intentionally not a section here — an AI funding/acquisition story belongs in Business, tagged `AI`, not siloed twice.)*

**Mobile**
- Smartphones · Wearables · Mobile OS · Mobile Accessories
- *(iPhone/Android/Samsung/Pixel are NOT sections — they're Entities/Tags, see §6. Making each a section would fragment "Mobile" into brand silos instead of topic silos.)*

**Hardware**
- Laptops & PCs · Components *(CPUs, GPUs, storage, motherboards — merged)* · Monitors & Peripherals · Networking Hardware

**Software**
- Apps · Operating Systems · Internet & Web · Cloud Computing · Open Source

**Big Tech**
- Company Strategy · Earnings & Business · Regulation & Antitrust · Leadership & Culture
- *(Not split per-company — Apple/Google/etc. are Entities. A section per company would duplicate the entity-page function.)*

**Data**
- Market Trackers *(recurring, updated)* · Industry Reports · Surveys & Adoption Data

**Security**
- Breaches & Vulnerabilities · Privacy · Enterprise Security · Consumer Security

**Business**
- Startups & Funding · Venture Capital · IPOs & M&A · Industry & Jobs

**Gaming**
- Console Gaming · PC Gaming · Mobile Gaming · Game Industry Business · Esports

**Future Tech & Science**
- Robotics · Space Tech · Quantum Computing · Biotech & Health Tech · Climate Tech

---

## 4. Content Types (Final List)

**News · Analysis · Explainer · How It Works · Guide · Buying Guide · Review · Comparison · Data Story · Report · Deep Dive · Opinion · Timeline · Interview**

12 formats — enough to be genuinely useful as a filter, not so many that editors face decision paralysis choosing one.

**Why Reviews/Comparisons/Guides/Explainers are Content Types, not Categories** (explicit reasoning, since this is the most common taxonomy mistake in tech media):

A review of the iPhone belongs topically under **Mobile**; a review of a laptop belongs under **Hardware**; a review of an AI tool belongs under **AI**. If "Reviews" were a category, every review would have to pick *either* its topic *or* its format as the primary hierarchy — you can't have both without duplicating the article into two conflicting trees. Worse, it would drain review content out of the Mobile/Hardware/AI category pages, weakening exactly the topical authority those pages need for SEO (Google increasingly evaluates topical depth per category).

The correct model: **Content Type is a facet, not a branch.** `/mobile/reviews/` is a *filtered view* of the Mobile category (category + content-type filter combined), not a separate taxonomy node with its own independent content pool. This gives you both: strong topical category pages, and format-based browsing (a reader who only wants comparisons can filter to them) — without duplicating or fragmenting anything.

**Guide vs. Buying Guide (kept separate):** a "Guide" answers *how do I do X*; a "Buying Guide" answers *what should I buy* — different search intent, different monetization (buying guides carry affiliate links; guides usually don't). Worth the extra type.

**Data Story vs. Report (kept separate):** a Data Story is a single-datapoint narrative tied to one stat or chart; a Report is a larger, periodic "state of X" publication (per STRATEGY §21 roadmap). Distinct enough in scope and cadence to justify two types.

---

## 5. Tag System

Tags are curated from a maintained list, not freely typed per-article (freeform tagging is the single biggest cause of taxonomy collapse by article #2,000). Four tag groups:

- **Companies** — Apple, Google, Microsoft, NVIDIA, OpenAI, Anthropic, Samsung, Meta, Amazon, Qualcomm, etc.
- **Products** — iPhone, Galaxy, Pixel, ChatGPT, Claude, Gemini, RTX, MacBook, Windows 12, etc.
- **Technologies** — LLM, Generative AI, 5G, Quantum Computing, Robotics, AR/VR, Edge Computing.
- **Topics/Attributes** — Privacy, Security, Performance, Battery Life, Cameras, Processors, Open Source, Pricing.

**What must NEVER become a tag:**
- Anything that's already a Category or Section (e.g. a tag called "AI" or "Mobile" — redundant, and it invites editors to tag instead of correctly categorizing).
- Content types (never tag "Review" or "Comparison" — that's the Content Type field, not a tag).
- Vague marketing adjectives ("Amazing," "Best," "Top") — not searchable, not filterable, pure noise.
- Dates/years as tags — publish date is metadata, not a tag.
- One-off, single-use labels — if a concept will likely only ever appear on one article, fold it into an existing broader tag instead of creating a new one.
- Author names as tags (that's what author pages are for).

**Guardrail:** cap at ~5–8 tags per article, and require every new tag to be approved into the maintained tag list before use (prevents "iPhone 17," "iPhone17," "iPhone 17 Pro" all existing as separate tags by year three).

---

## 6. Entity System — Recommended

Yes, entities should be a distinct layer from tags, for a defined, high-value set only (not every tag needs to become an entity).

**Recommendation:** treat **Companies** and **Products** as entities with dedicated hub pages (`/companies/apple`, `/products/chatgpt`), starting with the ~30–50 most-covered names, expanding only as coverage volume justifies a given entity's page.

**Why this is strategically justified:**
- **SEO** — entity pages match how Google's knowledge graph already understands "Apple" or "ChatGPT" as a distinct thing; a well-built entity hub can rank for the entity name itself and become a permanent landing page (this is the single highest-leverage SEO structure available to a tech publication, more durable than any individual news post).
- **Internal linking** — every article mentioning an entity links back to one canonical hub, concentrating link equity instead of scattering it across a generic tag page.
- **Content discovery** — a reader who wants "everything about OpenAI" gets one comprehensive, evergreen page instead of a chronological tag dump.
- **Future database growth** — as the article count scales to 10,000+, entity pages are what let the site say "we're the definitive source on X company/product," which a flat tag list cannot do.

**Difference from a Tag:** a Tag is just a filter label; an Entity has an authored, maintained hub page (short evergreen intro/description + auto-populated latest/related coverage) and is prioritized for internal linking. Not every tag graduates to entity status — only ones with sustained, recurring coverage.

---

## 7. Information Architecture — Hierarchy

```
Category
   └── Section
          └── Article
```
Applied as three independent facets on every Article:
```
Article
 ├── Category + Section        (where it lives — one primary home)
 ├── Content Type               (what kind of piece it is)
 ├── Tags                       (lightweight labels, 5–8 max)
 └── Entities                   (companies/products it centrally concerns)
```

**Example (from the brief, validated against this system):**

| Field | Value |
|---|---|
| Title | ChatGPT vs Claude: Which AI Is Better in 2026? |
| Category | AI |
| Section | AI Tools |
| Content Type | Comparison |
| Tags | LLM, Generative AI, Pricing, Performance |
| Entities | OpenAI, ChatGPT, Anthropic, Claude |

**Second example, testing a Hardware/Data crossover:**

| Field | Value |
|---|---|
| Title | GPU Market Share 2026: NVIDIA vs AMD vs Intel |
| Category | Data |
| Section | Market Trackers |
| Content Type | Data Story |
| Tags | Performance, Pricing |
| Entities | NVIDIA, AMD, Intel |

Note this article lives under **Data**, not Hardware — because its primary job is the statistic/trend, not a product review. It still cross-links heavily into Hardware's Components section via entity pages.

---

## 8. Navigation

**Primary Navigation** (7 items max, per usability best practice — this is a publication, not a mega-menu SaaS site):
```
Home · News · AI · Mobile · Hardware · Data · Security · More ▾
```
`News` is a **filtered stream** (all Categories, Content Type = News), not a category with unique content — it exists in primary nav because "just show me what's new" is the single most common intent on a news site's homepage, even though it's not a taxonomy node.

**More ▾ (secondary menu):**
```
Software · Big Tech · Business · Gaming · Future Tech & Science
```

**Format hubs** (footer + contextual links, not primary nav — they're useful but secondary to topical browsing):
```
Reviews · Comparisons · Guides · Explainers · Deep Dives
```

**Category page navigation** (tabs/filters within each category page):
```
All · News · Explainers · Reviews · Comparisons · Guides
```
This is where Content Type actually earns its UX value — filtering *within* a topic, not competing with topics for nav real estate.

**Tag navigation:** not in any nav menu. Tags surface contextually (as chips on articles, linking to tag archive pages) — see indexing rule in §9.

**Entity navigation:** top entities can appear in a "Companies" or "Popular" quick-link module (homepage sidebar / footer), but entity pages are primarily discovered via internal links from articles, not top nav.

**Search:** persistent, global, always visible in header — the fastest path for a returning reader who knows what they want.

**Trending:** homepage module (per STRATEGY §13), not a nav item — trending is a snapshot, not a stable destination worth a permanent URL slot.

---

## 9. SEO Taxonomy

| Node type | Indexable? | Rule |
|---|---|---|
| Category page | Yes | Always — primary landing/hub pages, core internal linking hubs |
| Section page | Conditional | Index once a section has 15+ published articles; below that, `noindex` and treat as a filter of the category page rather than a standalone page |
| Content-type archive (`/reviews/`, `/comparisons/`) | Yes | High commercial/search intent, worth indexing site-wide |
| Category + Content Type combo (`/mobile/reviews/`) | Yes, selectively | Index top combinations with real volume; `noindex` sparse combinations to avoid thin-content flags |
| Tag page | Default `noindex` | Only promote to indexable once a tag has 10+ quality articles *and* clear standalone search intent distinct from its parent category/section |
| Entity page | Yes, high priority | Treated as a mini-hub; authored intro content (not just an auto-list) required before publishing to avoid thin-content risk |
| Author page | Yes | Standard for E-E-A-T credibility signals |
| Deep filter combinations (tag + content type + pagination stacked) | `noindex`, `canonical` back to the nearest parent | Prevents combinatorial explosion of near-duplicate indexable URLs at scale |

**Canonical strategy:** every article has exactly one canonical URL, nested under its primary Category/Section (e.g. `/ai/ai-tools/chatgpt-vs-claude-2026/`). It can be *surfaced* via tag pages, entity pages, and content-type archives, but those are alternate discovery paths linking to the same canonical URL — never duplicate content.

**Breadcrumbs:** `Home > Category > Section > Article`, marked up with `BreadcrumbList` structured data — reinforces the hierarchy to Google exactly as designed here.

**Internal linking:** every article should link to (a) 2–4 related pieces from the same story cluster (news → explainer → data → comparison, per STRATEGY §6), (b) its Category/Section hub, and (c) each Entity it centrally concerns. This is what turns the taxonomy from a filing system into an actual SEO asset.

---

## 10. Editorial Examples (30 Articles)

| # | Title | Category | Section | Content Type | Tags | Entities |
|---|---|---|---|---|---|---|
| 1 | OpenAI Announces GPT-6 | AI | AI Models | News | LLM, Generative AI | OpenAI, ChatGPT |
| 2 | What Is Retrieval-Augmented Generation? | AI | AI Research | Explainer | LLM, Generative AI | — |
| 3 | Best AI Coding Assistants in 2026 | AI | AI Coding | Buying Guide | LLM, Open Source | GitHub Copilot, Claude, Cursor |
| 4 | ChatGPT vs Claude: Which AI Is Better? | AI | AI Tools | Comparison | LLM, Pricing | OpenAI, Anthropic |
| 5 | Inside Anthropic's Approach to AI Safety | AI | AI Research | Deep Dive | Generative AI | Anthropic |
| 6 | AI Agents Explained: How Do They Actually Work? | AI | AI Agents | How It Works | LLM | — |
| 7 | iPhone 18 Review | Mobile | Smartphones | Review | Cameras, Battery Life, Performance | Apple, iPhone |
| 8 | iPhone 18 vs Galaxy S26 Ultra | Mobile | Smartphones | Comparison | Cameras, Performance, Pricing | Apple, Samsung |
| 9 | Best Budget Android Phones | Mobile | Smartphones | Buying Guide | Battery Life, Pricing | Samsung, Google Pixel |
| 10 | Google Pixel Watch 4 First Look | Mobile | Wearables | News | Battery Life | Google |
| 11 | Android 17 Explained: Everything New | Mobile | Mobile OS | Explainer | Open Source, Performance | Google |
| 12 | Best Laptops for Developers in 2026 | Hardware | Laptops & PCs | Buying Guide | Performance, Pricing | Apple, Dell, Lenovo |
| 13 | RTX 6090 vs RTX 6080 | Hardware | Components | Comparison | Performance, Pricing | NVIDIA |
| 14 | How SSDs Actually Store Data | Hardware | Components | How It Works | Performance | — |
| 15 | MacBook Pro M6 Review | Hardware | Laptops & PCs | Review | Battery Life, Performance | Apple |
| 16 | Best 4K Monitors for Creators | Hardware | Monitors & Peripherals | Buying Guide | Pricing, Performance | — |
| 17 | Meta Layoffs: What's Really Happening | Big Tech | Company Strategy | Analysis | — | Meta |
| 18 | Apple Q3 2026 Earnings Breakdown | Big Tech | Earnings & Business | Report | — | Apple |
| 19 | EU's New AI Act: What It Means for Big Tech | Big Tech | Regulation & Antitrust | Explainer | Privacy | Apple, Google, Meta |
| 20 | Global Smartphone Market Share 2026 | Data | Market Trackers | Data Story | Performance, Pricing | Apple, Samsung, Google |
| 21 | AI Adoption Statistics: Who's Actually Using It | Data | Surveys & Adoption Data | Report | Generative AI | — |
| 22 | GPU Market Share: NVIDIA vs AMD vs Intel | Data | Market Trackers | Data Story | Performance, Pricing | NVIDIA, AMD, Intel |
| 23 | Major Data Breach Hits Cloud Provider X | Security | Breaches & Vulnerabilities | News | Privacy, Security | — |
| 24 | How to Actually Protect Your Privacy Online | Security | Consumer Security | Guide | Privacy | — |
| 25 | Zero-Day Explained: Why It's So Dangerous | Security | Breaches & Vulnerabilities | Explainer | Security | — |
| 26 | Startup X Raises $50M for AI Chips | Business | Startups & Funding | News | Generative AI | NVIDIA |
| 27 | Why VC Funding for AI Startups Is Slowing | Business | Venture Capital | Analysis | Generative AI | — |
| 28 | PS6 vs Xbox Series Z: Full Comparison | Gaming | Console Gaming | Comparison | Performance, Pricing | Sony, Microsoft |
| 29 | Inside the Business of Esports in 2026 | Gaming | Esports | Deep Dive | — | — |
| 30 | Quantum Computing Explained for Beginners | Future Tech & Science | Quantum Computing | Explainer | Quantum Computing | IBM, Google |

**Stress-testing this set:** every article has exactly one Category/Section home, no article needed a category that doesn't exist, no section shows signs of being too narrow (each has multiple plausible future articles), and Content Type never duplicates Category — validating the model.

---

## 11. Scalability Stress Test

**At ~100 articles:** taxonomy can't be meaningfully tested yet — most sections will look sparse regardless of design. This is expected and fine; resist the urge to prematurely merge sections based on early emptiness.

**At ~1,000 articles (~100/category average):**
- Categories function as genuine hubs. ✅
- Sections reach ~15–25 articles each on average — right at the "worth indexing" threshold from §9. ✅
- Major entity pages (Apple, OpenAI, NVIDIA) reach 10–20 articles — viable to index. ✅
- Risk: if tagging wasn't disciplined from day one, near-duplicate tags start appearing ("AI", "Generative AI", "GenAI"). Mitigation: the maintained tag whitelist from §5 must exist *before* article #1, not retrofitted at #1,000.

**At ~5,000 articles:**
- Category pages need pagination and default sorting (Latest / Most Read) to stay usable. ✅ (UX decision, not a taxonomy change.)
- Entity pages for top ~50 companies/products become substantial (50–150 articles each) — genuinely strong SEO assets, validating the entity-page investment. ✅
- If sections *had* been over-split at launch (separate CPU/GPU/Storage/Monitor sections instead of merged "Components"), some would now be bloated and others still thin — confirms the merge decision in §3 was correct; it's far easier to split an outgrown section later than to un-fragment several thin ones.
- Orphan-article risk appears here: manual editorial cross-linking alone won't scale. Recommend an automated "related articles" module driven by shared Entities/Tags, layered on top of (not replacing) manual story-cluster linking from STRATEGY §6.

**At ~10,000 articles:**
- Core taxonomy (10 categories, current sections) still holds — no category or section has become either empty or unmanageably huge, because the structure was built around durable topics, not fleeting trends.
- Real risk now is **combinatorial URL explosion** from faceted filtering (category + content type + tag + pagination stacked). Enforce the `noindex`/canonical rules from §9 strictly at this scale, or Google will crawl thousands of thin near-duplicate filter URLs and dilute crawl budget from the pages that actually matter.
- Consider splitting exactly one or two sections that *empirically* outgrew their category (e.g. if "Components" alone reaches several hundred articles, split GPUs out as its own section at that point — a data-driven split, not a guess made at launch).

**Conclusion:** the taxonomy as designed survives 100 → 10,000 articles without structural rework, because it was built on durable topic boundaries (Categories/Sections) kept separate from volatile, fast-multiplying facets (Tags/Content Types), with explicit thresholds for when a facet earns its own indexable page.

---

## 12. Competitor Information-Architecture Patterns (structure only, not branding)

| Pattern | Where it works well | Where it fails |
|---|---|---|
| Small, fixed top nav (7–9 items) with topic-based categories | The Verge, Ars Technica | — |
| Format-based sections (Reviews, Best Of) alongside topic sections | TechRadar, Tom's Hardware | Occasionally these compete for the same nav slots as topics, diluting both |
| Deep per-brand vertical sections (iPhone, Android as top-level areas) | 9to5Mac, Android Authority | Works because those sites are *intentionally* single-brand-focused — wrong pattern for a broad publication like BiDev Tech |
| Heavy tag/entity pages powering internal linking | TechCrunch (company/topic tag pages) | Tag pages left unmanaged become thin/duplicate over time — validates the curated-tag + indexing-threshold approach here |
| "Why it matters" / analysis framing baked into news coverage | MIT Technology Review | Slower cadence; BiDev Tech's cluster model (STRATEGY §6) aims to get this benefit without sacrificing news speed |

**Opportunity for BiDev Tech:** none of these combine disciplined topic categories *and* a genuine entity-page layer *and* a content-type facet as cleanly as designed here — most either sprawl their nav with brand-specific sections or let tag pages go thin and unmanaged. This taxonomy is the structural expression of the "news → explainer → data → comparison" differentiation from STRATEGY §6.

---

## 13. Final Recommended Taxonomy

**Categories** — all `KEEP`: AI, Mobile, Hardware, Software, Big Tech, Data, Security, Business, Gaming, Future Tech & Science.
**Developer Technology** — `FUTURE/OPTIONAL`, kept on legacy bidev.dev, cross-linked only.
**Startups** — `MERGE` into Business (as a Section).
**Apps, Internet, Cloud** — `MERGE` into Software (as Sections).
**News** — `REMOVE as a category`; kept only as a cross-cutting Content Type + nav filter.
**Reviews / Comparisons / Guides / Explainers** — `REMOVE as categories`; `KEEP` as Content Types + optional format-hub pages.
**Sections** — as listed in §3, all `KEEP`, with per-brand or per-component sections (iPhone, Android, CPU, GPU, etc.) explicitly `REMOVE as sections` in favor of Entities.
**Entities** — `KEEP`, launch with top 30–50 Companies/Products, expand over time (`FUTURE` for lower-volume entities).
**Tags** — `KEEP`, but only from a maintained/curated list from day one — free-form tagging `REMOVE`.
**Series** — `OPTIONAL`, lightweight editorial feature, not part of core hierarchy; revisit once there's a clear recurring-column use case.

---

## 14. Final Recommended Navigation

**Primary:**
```
Home  |  News  |  AI  |  Mobile  |  Hardware  |  Data  |  Security  |  More ▾
```

**More ▾:**
```
Software  |  Big Tech  |  Business  |  Gaming  |  Future Tech & Science
```

**Footer (format hubs + utility):**
```
Reviews  |  Comparisons  |  Guides  |  Explainers  |  Deep Dives  |  Newsletter  |  About  |  Advertise
```

**Header utility (always visible):** Search icon/bar. Trending surfaces as a homepage module, not a nav item.

---

## 15. Summary

This taxonomy separates three independent dimensions that most tech-media sites conflate — **topic** (Category/Section), **format** (Content Type), and **subject** (Tags/Entities) — and applies explicit, threshold-based rules for which nodes ever become indexable pages. It's built to hold structurally from 100 to 10,000+ articles without rework: durable topic boundaries stay fixed, while the faster-multiplying facets (tags, filter combinations) are the only things ever pruned or expanded.

No code, database schema, or URL has been implemented — this is the reference document `.claude/skills/tech-blog-design/SKILL.md` and any future content/database work should be built against.