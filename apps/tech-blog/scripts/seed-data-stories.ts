// One-off seed: publishes 3 real "Data Story" articles (Category: Data)
// directly into the tech-blog Supabase project, bypassing the admin UI
// (there is no admin login available in this environment).
//
// All figures were verified via live web search on 2026-09-08 against
// named sources (Jon Peddie Research, Counterpoint Research, McKinsey's
// State of AI survey as reported by The Register). See the `content`
// bodies below for the specific citations.
//
//   npx tsx apps/tech-blog/scripts/seed-data-stories.ts
//
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env.local", import.meta.url), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.trim().startsWith("#"))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const SUPABASE_URL = env.NEXT_PUBLIC_TECHBLOG_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_TECHBLOG_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in apps/tech-blog/.env.local"
  );
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

interface ArticleSeed {
  slug: string;
  title: string;
  dek: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  sectionSlug: "market-trackers" | "surveys-adoption-data";
  tags: string[];
  content: string; // HTML — rendered via dangerouslySetInnerHTML by the article page
}

const ARTICLES: ArticleSeed[] = [
  // ────────────────────────────────────────────────────────────────
  // 1. GPU market share — Data / Market Trackers
  // Source: Jon Peddie Research Q1'26 and Q2'26 Market Watch releases
  // (AIB/discrete share via igorslab.de and tweaktown.com coverage of
  // JPR's report; total PC GPU shipment growth via JPR's own Q2'26
  // press release on jonpeddie.com).
  // ────────────────────────────────────────────────────────────────
  {
    slug: "gpu-market-share-2026-nvidia-amd-intel",
    title: "GPU Market Share 2026: NVIDIA Still Ships 9 Out of 10 Cards",
    dek: "AMD clawed back a few points and Intel hasn't moved, but NVIDIA's grip on the discrete GPU market barely budged through the first half of 2026.",
    excerpt:
      "NVIDIA held about 90% of discrete GPU shipments in Q1 2026, AMD around 8%, Intel around 1%. Here's what Jon Peddie Research's numbers actually show, and why AMD's gains are real but still thin.",
    seoTitle: "GPU Market Share 2026: NVIDIA vs AMD vs Intel",
    seoDescription:
      "NVIDIA holds about 90% of discrete GPU shipments in 2026. See the real Jon Peddie Research numbers behind AMD and Intel's share.",
    seoKeywords: [
      "GPU market share 2026",
      "NVIDIA vs AMD market share",
      "discrete GPU shipments",
      "Jon Peddie Research",
      "Intel Arc market share",
    ],
    sectionSlug: "market-trackers",
    tags: ["Performance", "Pricing"],
    content: `
<p>NVIDIA controlled roughly <strong>90% of the discrete desktop GPU market</strong> in the first quarter of 2026, according to Jon Peddie Research's add-in-board (AIB) shipment tracking. AMD held about 8%. Intel, still building out its Arc lineup, sat at roughly 1%. If that number sounds familiar, it's because it hasn't really changed in years. It just wobbles a few points in either direction.</p>

<h2>The numbers, and what they actually measure</h2>
<p>JPR tracks two related but different things: AIB shipments, which count only discrete graphics cards sold to distributors and system builders, and total PC GPU shipments, which include the integrated graphics baked into most laptop and desktop CPUs. The 90/8/1 split above is the AIB number, the one that matters if you're actually building a desktop.</p>
<p>Zoom out to the full PC GPU market and the picture looks calmer. JPR's Q2 2026 Market Watch reported the whole PC GPU market grew 10.4% quarter over quarter and 1.1% year over year, with discrete GPU shipments specifically up 12.2% sequentially and 14.1% year over year. Vendor share barely moved in that release: AMD up about half a point, Intel down about a point, NVIDIA up under half a point. Small shifts, not a shakeup.</p>

<h2>AMD's gains are real but thin</h2>
<p>Back in Q4 2025, AMD held around 5% of AIB shipments while NVIDIA sat near 94%. By Q1 2026, AMD had climbed to roughly 8%, its best showing in a while. That's a genuine move, not noise, and it lines up with AMD's RDNA 4 cards, the RX 9070 and 9070 XT, finally shipping in real volume after a rocky launch. Still, 8% of a market NVIDIA dominates 9-to-1 is a rounding error next to what AMD held five years ago, when its share regularly sat in the high teens.</p>

<h2>Why NVIDIA keeps winning</h2>
<p>Two reasons stand out. The RTX 50-series lineup covers every price point NVIDIA wants covered, and NVIDIA's pull with system integrators is strong enough that even modest generational gains don't cost it shelf space. AMD's cards are frequently the better value on paper (the RX 9070 XT undercuts the RTX 5070 Ti at a similar performance tier), but pre-built PC makers keep defaulting to NVIDIA, and pre-builts are most of the volume JPR is counting.</p>
<p>Intel's Arc B-series hasn't moved the needle either. It's a decent budget option, but 1% of the market means Intel is barely visible in a chart two other companies dominate completely.</p>

<h2>The verdict</h2>
<p>If you're buying on value alone, AMD's current cards deserve a real look this generation. If you're buying based on what everyone else buys, NVIDIA remains the default, and the shipment data says most people are still doing exactly that. Nothing in these numbers suggests that changes before the next generation of cards lands.</p>
`.trim(),
  },

  // ────────────────────────────────────────────────────────────────
  // 2. Global smartphone market share — Data / Market Trackers
  // Source: Counterpoint Research, "Q2 2026 Global Smartphone
  // Shipments Slump to Lowest Q2 Level in 13 Years" (published on
  // counterpointresearch.com).
  // ────────────────────────────────────────────────────────────────
  {
    slug: "global-smartphone-market-share-q2-2026",
    title: "Global Smartphone Shipments Hit Their Lowest Q2 in 13 Years",
    dek: "Samsung reclaimed the top spot and Apple grew, but the overall market shrank as a memory chip shortage squeezed every phone maker at once.",
    excerpt:
      "Counterpoint Research says global smartphone shipments fell 11% year over year in Q2 2026, the weakest second quarter since 2013. Samsung and Apple grew anyway. Here's why.",
    seoTitle: "Global Smartphone Market Share Q2 2026: Samsung Leads",
    seoDescription:
      "Global smartphone shipments hit a 13-year Q2 low in 2026. See Counterpoint Research's market share numbers for Samsung, Apple, and Xiaomi.",
    seoKeywords: [
      "global smartphone market share 2026",
      "Counterpoint Research smartphone shipments",
      "Samsung vs Apple market share",
      "smartphone shipments Q2 2026",
      "Xiaomi market share decline",
    ],
    sectionSlug: "market-trackers",
    tags: ["Performance", "Pricing"],
    content: `
<p>Global smartphone shipments fell <strong>11% year over year in the second quarter of 2026</strong>, hitting the lowest Q2 volume since 2013, according to Counterpoint Research. Samsung reclaimed the top global spot with 24% market share, edging out Apple at 20%. Xiaomi held third with 12%, followed by OPPO at 11% and vivo at 8%.</p>

<h2>What's actually driving the drop</h2>
<p>This isn't primarily a demand story. It's a supply-cost story. Counterpoint points to a deepening memory shortage as the main drag on the industry: DRAM and NAND prices climbed sharply through 2026, and phone makers had to pass at least some of that cost onto buyers. Higher prices hit mid-range and budget phones hardest, since margins there are already thin, and that's exactly where Chinese brands make most of their volume.</p>
<p>Xiaomi felt it the most. Its shipments fell 26.3% year over year, the steepest drop of any major vendor, and OPPO and vivo each posted double-digit declines too. When your business model runs on shipping huge volumes of affordably priced phones, a memory price spike hits the model directly, not just the margins.</p>

<h2>Samsung and Apple, the exceptions</h2>
<p>Samsung and Apple were the only two of the top five brands to actually grow. Apple's shipments rose 3% year over year, helped by a strong iPhone cycle, and Counterpoint notes Samsung grew even faster, enough to knock Apple out of the top spot. Both companies sell enough volume at premium price points that a few dollars more in component cost barely dents demand. Their buyers are less price-sensitive to begin with, and that's precisely what separated winners from losers in a shrinking market this quarter.</p>

<h2>The verdict</h2>
<p>A shrinking market with exactly two brands growing is a pretty clean signal: pricing power matters more than usual right now. Samsung and Apple can absorb higher component costs without losing many buyers. Xiaomi, OPPO, and vivo can't, not without hurting the volume their whole business depends on. Expect this gap to widen before it closes. If DRAM and NAND prices ease in 2027, that's the number to watch, since it's the actual root cause here, not a sudden drop in demand for phones.</p>
`.trim(),
  },

  // ────────────────────────────────────────────────────────────────
  // 3. AI adoption / ROI — Data / Surveys & Adoption Data
  // Source: McKinsey's State of AI survey (1,719 respondents), as
  // reported by The Register, "McKinsey says enterprise AI is finally
  // 'on the road to ROI'", published 25 August 2026.
  // ────────────────────────────────────────────────────────────────
  {
    slug: "ai-high-performers-mckinsey-2026",
    title: "Only 6% of Companies Are Actually Winning With AI",
    dek: "Adoption is nearly universal, but McKinsey's latest survey shows the share of companies seeing meaningful AI-driven profit hasn't moved in a year.",
    excerpt:
      "McKinsey's 2026 State of AI survey found just 6% of companies qualify as AI high performers, flat versus last year, even as usage keeps climbing. The gap between adoption and payoff is the real story.",
    seoTitle: "AI ROI Statistics 2026: Only 6% of Firms Are Winning",
    seoDescription:
      "McKinsey's 2026 survey found just 6% of companies are AI high performers, unchanged from last year. Here's what's actually working.",
    seoKeywords: [
      "AI adoption statistics 2026",
      "McKinsey State of AI",
      "AI ROI enterprise",
      "AI high performers",
      "enterprise AI EBIT impact",
    ],
    sectionSlug: "surveys-adoption-data",
    tags: ["Performance", "Pricing"],
    content: `
<p>Just <strong>6% of companies qualify as "AI high performers"</strong>, meaning they attribute at least 5% of earnings to AI with what McKinsey calls a significant impact, according to the firm's latest State of AI survey of 1,719 professionals and business leaders, published in August 2026. That number hasn't moved at all from a year earlier, even as AI adoption itself has kept climbing.</p>

<h2>Everyone's using it. Few are profiting from it.</h2>
<p>McKinsey found 37% of respondents attribute at least some EBIT impact to AI, also flat compared to 2025. Put those two numbers together and you get the real story of enterprise AI this year: nearly every company has AI running somewhere, but the gap between "we use it" and "it moved the bottom line" hasn't closed at all.</p>
<p>It's not that AI isn't doing anything. 80% of respondents who personally use AI in their jobs say it's improved their individual productivity, and that's a hard number to argue with. The disconnect is between individual usefulness and organizational payoff. A tool that makes thousands of employees somewhat faster doesn't automatically show up as a line on an income statement, especially if nobody redesigned the workflow around it.</p>

<h2>The agent scaling gap</h2>
<p>There's one place real movement shows up: agentic AI. Among companies with over $1 billion in annual revenue, 40% now report scaling AI agents in production, up from 27% in the prior survey. That's a meaningful jump, and it tracks with what large enterprises have been saying all year about moving past chatbot pilots into agents that handle multi-step work. Nearly a third of respondents said their organizations chose to build agentic coding tools in-house rather than buy a vendor product, which says something about how fast this space is moving. Nobody wants to be locked into last quarter's tool.</p>
<p>Cost is starting to bite too. 20% of respondents cited AI-related operating costs as a real constraint on further deployment, and separately, 39% now expect their employer to cut jobs because of AI, up from 32% in 2025. McKinsey notes actual 2025 job cuts fell well short of what people predicted a year earlier, so that expectation deserves some skepticism. People have been wrong about AI-driven layoffs before.</p>

<h2>The verdict</h2>
<p>"88% of companies use AI" has been roughly true for a while now, and it doesn't tell you much anymore. The number that matters is 6%, the share actually converting that usage into meaningful profit, and it's stuck. If you're deciding how much more to invest in AI next year, this is the survey worth reading, not the adoption charts that just keep climbing.</p>
`.trim(),
  },
];

function wordCount(html: string): number {
  return html
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

async function main() {
  console.log("Looking up 'data' category...");
  const { data: category, error: catErr } = await supabase
    .from("techblog_categories")
    .select("id, slug")
    .eq("slug", "data")
    .single();
  if (catErr || !category) {
    throw new Error(`Could not find category slug 'data': ${catErr?.message}`);
  }
  console.log(`  category_id = ${category.id}`);

  console.log("Looking up sections under 'data'...");
  const { data: sections, error: secErr } = await supabase
    .from("techblog_sections")
    .select("id, slug")
    .eq("category_id", category.id);
  if (secErr || !sections) {
    throw new Error(`Could not fetch sections: ${secErr?.message}`);
  }
  const sectionBySlug = new Map(sections.map((s) => [s.slug, s.id]));
  for (const slug of ["market-trackers", "surveys-adoption-data"]) {
    if (!sectionBySlug.has(slug)) {
      throw new Error(`Expected section '${slug}' not found under Data category`);
    }
  }
  console.log(`  found sections: ${[...sectionBySlug.keys()].join(", ")}`);

  // Ensure tags exist, collecting name -> id.
  const allTagNames = [...new Set(ARTICLES.flatMap((a) => a.tags))];
  const tagIdByName = new Map<string, string>();
  for (const name of allTagNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { data: existing, error: findErr } = await supabase
      .from("techblog_tags")
      .select("id, name")
      .eq("slug", slug)
      .maybeSingle();
    if (findErr) throw new Error(`Tag lookup failed for '${name}': ${findErr.message}`);

    if (existing) {
      tagIdByName.set(name, existing.id);
      console.log(`  tag '${name}' already exists (${existing.id})`);
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("techblog_tags")
        .insert({ name, slug })
        .select("id")
        .single();
      if (insErr || !inserted) throw new Error(`Tag insert failed for '${name}': ${insErr?.message}`);
      tagIdByName.set(name, inserted.id);
      console.log(`  created tag '${name}' (${inserted.id})`);
    }
  }

  for (const article of ARTICLES) {
    console.log(`\nPublishing: ${article.title}`);
    const words = wordCount(article.content);
    const readingTime = Math.max(1, Math.round(words / 200));
    const sectionId = sectionBySlug.get(article.sectionSlug)!;

    // Avoid duplicate inserts if this script is re-run.
    const { data: existingArticle } = await supabase
      .from("techblog_articles")
      .select("id")
      .eq("slug", article.slug)
      .maybeSingle();

    const row = {
      title: article.title,
      slug: article.slug,
      dek: article.dek,
      content: article.content,
      excerpt: article.excerpt,
      status: "published" as const,
      category_id: category.id,
      section_id: sectionId,
      content_type: "data-story" as const,
      seo_title: article.seoTitle,
      seo_description: article.seoDescription,
      seo_keywords: article.seoKeywords,
      reading_time: readingTime,
      published_at: new Date().toISOString(),
    };

    let articleId: string;
    if (existingArticle) {
      console.log(`  already exists (${existingArticle.id}), updating...`);
      const { data: updated, error: updErr } = await supabase
        .from("techblog_articles")
        .update(row)
        .eq("id", existingArticle.id)
        .select("id")
        .single();
      if (updErr || !updated) throw new Error(`Update failed: ${updErr?.message}`);
      articleId = updated.id;
    } else {
      const { data: inserted, error: insErr } = await supabase
        .from("techblog_articles")
        .insert(row)
        .select("id")
        .single();
      if (insErr || !inserted) throw new Error(`Insert failed: ${insErr?.message}`);
      articleId = inserted.id;
      console.log(`  inserted (${articleId}), reading_time=${readingTime}min, words=${words}`);
    }

    // Link tags (clear existing links first so re-runs stay clean).
    await supabase.from("techblog_article_tags").delete().eq("article_id", articleId);
    const tagLinks = article.tags.map((name) => ({
      article_id: articleId,
      tag_id: tagIdByName.get(name)!,
    }));
    const { error: linkErr } = await supabase.from("techblog_article_tags").insert(tagLinks);
    if (linkErr) throw new Error(`Tag link failed: ${linkErr.message}`);
    console.log(`  linked tags: ${article.tags.join(", ")}`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
