# BiDev — Future Features & Updates

A running list of everything planned for bidev.dev and the admin panel.
Mark items `[x]` when done, move them to the Done section at the bottom.

---

## 🚨 URGENT — Must Do First

These are **blockers** — the site has broken or missing functionality until these are done.

| # | Task | Why Urgent |
|---|------|-----------|
| 1 | **Run migration `006_products.sql`** in Supabase SQL Editor | Products page is live but the DB table doesn't exist yet — every visit errors |
| 2 | **Run migration `007_products_purchase_urls.sql`** in Supabase SQL Editor | ZIP + GitHub Access purchase URLs won't save without this column |
| 3 | **Run migration `008_page_views.sql`** in Supabase SQL Editor | Analytics page shows nothing — the `page_views` table and `upsert_page_view` function don't exist yet |
| 4 | **Add `logo.png` (512×512 square PNG) to `/apps/main-site/public/`** | Organization schema points to `/logo.png` — Google shows no icon for your site in search results |
| 5 | **Replace AdSense slot ID `1838201594`** with real slot IDs from your AdSense dashboard | All ad units on the site are using a placeholder — no revenue being earned |
| 6 | **Request re-indexing in Google Search Console** for `https://bidev.dev` and key pages | Domain was migrated from bidev.site — Google still shows old URLs until recrawled |
| 7 | **Add `pub.dev` publisher verification** (`publisher: bidev.dev`) to `flutter_timer_button` | Package shows no verified publisher — hurts credibility and pub points score |

---

## 🌐 Main Site

### Blog & Content
- [ ] Article series — group related posts into a series with prev/next navigation
- [ ] Reading progress bar on article pages (sticky top bar that fills as you scroll)
- [ ] Estimated reading time shown on blog listing cards
- [ ] "Last updated" badge on articles older than 6 months that were recently revised
- [ ] Code block copy-button on all `<pre>` blocks in MDX articles
- [ ] Article table of contents auto-generated from headings (already in sidebar — also add inline TOC at top of long articles)
- [ ] Bookmark / save articles (localStorage, no login required)
- [ ] Print-friendly article stylesheet
- [ ] Dark/light mode toggle (site is dark-only right now)
- [ ] Search across all content types (blog + snippets + tools + packages)
- [ ] Related snippets shown at the bottom of blog articles

### /topics Page
- [ ] Make /topics visible in nav again when content grows
- [ ] Add `/category/[slug]` route so "View all X articles" links go to a dedicated page
- [ ] Category page with its own SEO metadata and structured data
- [ ] Filter pills on /topics that work client-side without page reload

### /packages Page
- [ ] Individual package detail page `/packages/[name]` with full README rendered
- [ ] "How to install" code snippet with copy button (pubspec.yaml + flutter pub get)
- [ ] Changelog section pulled from GitHub releases API
- [ ] GitHub stars count (via GitHub API, ISR cached)
- [ ] "Open issues" count badge from GitHub API

### /products Page
- [ ] Product image gallery lightbox (click thumbnail → full-screen overlay)
- [ ] Product reviews / ratings system (Supabase table)
- [ ] Discount coupon code field on product detail page
- [ ] "People also bought" cross-sell section
- [ ] Wishlist / save product (localStorage)
- [ ] Filter products by price range
- [ ] Sort products: newest, price low→high, popular
- [ ] Product preview / demo video embed (YouTube or direct mp4)

### /snippets Page
- [ ] Snippet difficulty levels (Beginner / Intermediate / Advanced) badge on cards
- [ ] Copy snippet button (one-click copy the full code)
- [ ] "Run on DartPad" button for pure Dart/Flutter snippets
- [ ] User-contributed snippets (admin-approved flow)
- [ ] Snippet collections / playlists

### /tools Page
- [ ] Flutter Color Palette generator tool
- [ ] Dart Regex tester (already exists — improve with named groups, multiline mode)
- [ ] Pubspec.yaml validator / formatter tool
- [ ] App icon generator (upload image → export all Flutter icon sizes)
- [ ] Localization helper (ARB file generator)
- [ ] Firebase Rules validator
- [ ] Changelog generator tool (commits → CHANGELOG.md)

### /jobs Page
- [ ] Job alert email subscription (notify when new Flutter jobs posted)
- [ ] Company profile pages `/jobs/company/[slug]`
- [ ] Job application tracking (for users — save/track applied jobs in localStorage)
- [ ] Salary range filter
- [ ] "Remote only" toggle filter
- [ ] Job posting expiry (auto-unpublish after 30 days unless renewed)

### /resources Page
- [ ] User upvote on resources (Supabase, no auth required — IP-based)
- [ ] "Added this week" badge on new resources
- [ ] Resource submission form (community suggests resources, admin approves)

### Flutter Interview Questions
- [ ] Practice mode — quiz-style flashcard view
- [ ] Difficulty filter (Junior / Mid / Senior)
- [ ] "Mark as reviewed" (localStorage)
- [ ] Shareable link per question
- [ ] PDF export of all questions

### Homepage
- [ ] Testimonials / social proof section
- [ ] Newsletter signup section (already exists — add double opt-in email confirmation)
- [ ] GitHub activity feed / latest open source contributions
- [ ] Recent YouTube videos section (YouTube API, ISR)
- [ ] Stats bar: X articles · X snippets · X tools · X packages

### SEO & Performance
- [ ] Add `logo.png` (512×512 square) to /public — fixes Organization schema logo in Google
- [ ] Request re-indexing in Google Search Console after domain migration
- [ ] Add `hreflang` tags if Arabic content is added
- [ ] Structured data: add `HowTo` schema to tutorial articles
- [ ] Structured data: add `TechArticle` type to code-heavy posts
- [ ] Image `alt` text audit across all pages
- [ ] Core Web Vitals audit after next major feature drop
- [ ] Add `<link rel="preconnect">` for Supabase domain

### Analytics & Monetization
- [ ] Run `supabase/migrations/008_page_views.sql` — unified page view tracking
- [ ] Run `supabase/migrations/006_products.sql` and `007_products_purchase_urls.sql`
- [ ] AdSense ad unit slot IDs — replace placeholder `1838201594` with real slot IDs
- [ ] Revenue dashboard in admin: estimated earnings from products + AdSense
- [ ] Affiliate links tracker (track clicks on resource affiliate links)
- [ ] Floating BuyMeCoffee button on /blog/[slug] after 50% scroll depth (was deferred — ask before adding)

---

## 🛠 Admin Panel

### Articles
- [ ] Bulk publish / unpublish articles
- [ ] Article duplicate button
- [ ] Schedule publish (set future publish date)
- [ ] Article version history (save drafts with timestamps)
- [ ] Featured article pin (appears at top of blog listing)
- [ ] Article import from Markdown/MDX file upload
- [ ] SEO score checker built into editor (checks title length, description, heading structure)
- [ ] Word count and readability score in editor

### Media
- [ ] Media library grid view (see all uploaded images)
- [ ] Image search by filename
- [ ] Delete unused images from Supabase Storage
- [ ] Image resize / optimize on upload

### Products
- [ ] Product duplication button
- [ ] Bulk status change (publish/draft multiple products)
- [ ] Product analytics: views, add-to-cart, conversions
- [ ] Digital delivery automation (auto-send download link after Payhip purchase via webhook)
- [ ] GitHub Access request auto-invite via GitHub API (instead of manual)
- [ ] Product categories management UI (add/edit/delete categories in admin)

### Orders & GitHub Access
- [ ] Order export to CSV
- [ ] GitHub Access bulk grant (select multiple → invite all)
- [ ] Email notification to buyer when GitHub access is granted
- [ ] GitHub Access request webhook from Payhip (auto-create request on purchase)

### Comments
- [ ] Approve / reject comments before they appear publicly
- [ ] Comment spam filter (keyword blocklist)
- [ ] Reply to comments from admin
- [ ] Comment export

### Analytics Dashboard
- [ ] Chart visualizations (views over time line graph per content type)
- [ ] Top referrer sources breakdown
- [ ] Geographic breakdown of readers
- [ ] Real-time visitor count (Supabase Realtime or Clarity integration)
- [ ] Compare periods (this week vs last week)

### Settings
- [ ] Newsletter subscriber list management
- [ ] Email template editor (for order confirmations, GitHub access emails)
- [ ] API key management (rotate Supabase keys, manage third-party integrations)
- [ ] Sitemap regeneration trigger button
- [ ] Backup / export all content as JSON

---

## 📦 Packages & Open Source

- [ ] Publish `flutter_timer_button` v2.0 with null safety updates
- [ ] New package idea: `flutter_skeleton_loader` — customizable shimmer loading placeholders
- [ ] New package idea: `flutter_form_validator` — declarative form validation
- [ ] New package idea: `dart_result` — Result<T, E> type for error handling
- [ ] Add package pub.dev publisher verification (publisher: bidev.dev)
- [ ] Automated pub.dev badge in GitHub README for each package

---

## 🗄 Infrastructure & DevOps

- [ ] Set up Vercel preview deployments for PRs
- [ ] Add GitHub Actions CI: typecheck + build on every push
- [ ] Environment variable validation on startup (throw if required vars missing)
- [ ] Supabase database backups (enable in Supabase dashboard)
- [ ] Rate limiting on `/api/track` and `/api/views` endpoints
- [ ] Add `robots.txt` disallow for `/admin` (admin is a separate app but good practice)
- [ ] Error monitoring (Sentry or Vercel monitoring)
- [ ] Uptime monitoring (Better Uptime or similar)

---

## ✅ Done

- [x] Domain migration: bidev.site → bidev.dev (301 redirects via middleware)
- [x] Microsoft Clarity analytics added
- [x] Unified page view tracking (page_views table + /api/track)
- [x] Products module (/products, /products/[slug], admin CRUD)
- [x] Dual purchase URLs: ZIP + GitHub Private Access
- [x] Tiptap rich text editor in admin (description, features, what's included)
- [x] Canvas cover image generator in admin
- [x] Cover image drag-and-drop upload
- [x] Jobs board (/jobs, admin CRUD)
- [x] Flutter Packages section (/packages with live pub.dev stats)
- [x] Buy Me a Coffee button (footer + end of articles, no embed script)
- [x] /topics tutorial-hub page (hidden from nav, ready to show)
- [x] Reusable ArticleCard component
- [x] Organization JSON-LD schema (BiDev brand)
- [x] SEO: SITE_NAME rebranded to "BiDev" across all pages
- [x] GitHub Access requests admin page
- [x] Orders admin page
- [x] Analytics admin page (unified by content type)
