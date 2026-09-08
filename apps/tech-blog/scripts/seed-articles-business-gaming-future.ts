// One-off seed: publishes 3 real articles, one each for Business, Gaming,
// and Future Tech & Science, directly into the tech-blog Supabase project
// (there is no admin login available in this environment).
//
// All figures were verified via live web search on 2026-09-08 against named,
// primary sources: GlobeNewswire's Gimlet Labs press release, EA's own press
// release plus Bloomberg/S&P Global/Variety reporting on the buyout close,
// and NASA's own press release on the Roman Space Telescope launch. See the
// `content` bodies below for the specific citations.
//
//   npx tsx apps/tech-blog/scripts/seed-articles-business-gaming-future.ts
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
  categorySlug: "business" | "gaming" | "future-tech-science";
  sectionSlug: string;
  contentType:
    | "news"
    | "analysis"
    | "explainer"
    | "how-it-works"
    | "guide"
    | "buying-guide"
    | "review"
    | "comparison"
    | "data-story"
    | "report"
    | "deep-dive"
    | "opinion"
    | "timeline"
    | "interview";
  tags: string[];
  content: string; // HTML — rendered via dangerouslySetInnerHTML by the article page
}

const ARTICLES: ArticleSeed[] = [
  // ────────────────────────────────────────────────────────────────
  // 1. Business — Gimlet Labs $300M Series B
  // Source: GlobeNewswire press release (Sept 4, 2026), corroborated by
  // Pulse2, Converge Digest, ChannelInsider, HostingJournalist.
  // ────────────────────────────────────────────────────────────────
  {
    slug: "gimlet-labs-300-million-series-b-multi-silicon-ai-cloud",
    title: "Gimlet Labs Raises $300M at $3B Valuation for Its AI Inference Cloud",
    dek: "Andreessen Horowitz led a Series B that triples Gimlet's valuation in six months, betting that spreading AI workloads across different chips beats betting on one.",
    excerpt:
      "Gimlet Labs just raised $300 million at a $3 billion valuation to keep building a cloud that runs AI inference across GPUs, accelerators, and CPUs from multiple vendors at once. Here's what the deal actually says about where AI infrastructure spending is heading.",
    seoTitle: "Gimlet Labs Raises $300M Series B at $3B Valuation",
    seoDescription:
      "Gimlet Labs raised a $300M Series B led by Andreessen Horowitz at a $3B valuation for its multi-silicon AI inference cloud. Here's what it means.",
    seoKeywords: [
      "Gimlet Labs funding",
      "Gimlet Labs Series B",
      "AI inference cloud",
      "multi-silicon AI infrastructure",
      "Andreessen Horowitz AI investment",
    ],
    categorySlug: "business",
    sectionSlug: "startups-funding",
    contentType: "news",
    tags: ["Generative AI", "Performance", "Processors"],
    content: `
<p>Gimlet Labs has raised <strong>$300 million in a Series B round at a $3 billion valuation</strong>, according to a company announcement on September 4, 2026. Andreessen Horowitz led the round, with Sapphire Ventures, M12, and chip designer Arm joining as new investors alongside existing backers Menlo Ventures and Factory. The raise brings Gimlet's total funding to $392 million and roughly triples its valuation from where it stood after emerging from stealth less than a year ago.</p>

<h2>What Gimlet actually sells</h2>
<p>Gimlet's pitch is narrow and, if it works, genuinely useful: don't run every AI inference workload on the same type of chip. The San Francisco company built software that splits an AI model's inference process into phases and routes each phase to whichever hardware handles it best, whether that's a GPU, a custom accelerator, or a CPU from a different vendor entirely. The company calls it a "multi-silicon inference cloud," and it's aimed squarely at agentic AI workloads, the multi-step, tool-calling systems that are far heavier and more variable than a single chatbot reply.</p>
<p>Co-founder and CEO Zain Asgar put it plainly in the announcement: "We're able to deliver unprecedented performance because Gimlet software intelligently slices and orchestrates their workloads across different types of hardware." The company claims up to 10x gains in throughput and interactivity from that approach, though those are Gimlet's own figures rather than an independent benchmark.</p>

<h2>The traction behind the price tag</h2>
<p>A $3 billion valuation for a company that only left stealth in October 2025 sounds aggressive until you look at what Gimlet says it's landed since. By March 2026 it had tripled its customer base and signed one of the top three frontier AI labs and one of the top three hyperscalers as customers. It also says it has since secured billions of dollars in contracted revenue for its Gimlet Cloud product and is scaling infrastructure toward hundreds of megawatts. Gimlet joined MLCommons, the industry benchmarking consortium, in June 2026, a move that reads like a company trying to get its performance claims independently measured rather than just self-reported.</p>

<h2>Why this matters beyond one funding round</h2>
<p>The bigger signal here isn't the dollar figure. It's who's writing checks. Arm doesn't typically invest in AI infrastructure startups unless it sees its own chip designs benefiting from wider adoption of heterogeneous compute. A hyperscaler and a frontier lab both becoming paying customers, not just pilot partners, suggests the biggest AI spenders are actively looking for ways to stop over-relying on a single chip supplier for inference, even as that same supplier keeps winning most of the training market.</p>
<p>That's a real shift. For most of the current AI boom, the story has been simple: buy more GPUs from one company. Gimlet's raise is a bet that the inference side of AI, which is where the actual day-to-day cost of running these systems lives, splits differently than the training side did.</p>

<h2>The verdict</h2>
<p>$300 million is a big check for a company with no independently audited performance numbers yet. But the investor list and the customer list both say something that matters more than the price: serious money believes inference workloads won't stay locked to one type of chip. If Gimlet's real-world numbers hold up to outside scrutiny once MLCommons results are public, this round will look cheap in hindsight. If they don't, it joins a long list of infrastructure startups that raised big on a good pitch and a thin track record.</p>
`.trim(),
  },

  // ────────────────────────────────────────────────────────────────
  // 2. Gaming — EA's $55B buyout officially closed
  // Sources: EA's own press release (ea.com/news), Bloomberg ("largest
  // leveraged buyout on record"), Variety and Yahoo Finance reporting on
  // the August 4, 2026 close, S&P Global's TXU Energy comparison.
  // ────────────────────────────────────────────────────────────────
  {
    slug: "ea-55-billion-buyout-closed-largest-leveraged-buyout-in-history",
    title: "EA's $55 Billion Buyout Just Closed. It's the Biggest LBO Ever",
    dek: "Electronic Arts is officially private after the largest leveraged buyout on record, and the $20 billion in new debt is the part worth watching now.",
    excerpt:
      "EA's $55 billion sale to PIF, Silver Lake, and Jared Kushner's Affinity Partners closed on August 4, 2026, beating the 2007 TXU Energy deal as the largest leveraged buyout in history. Here's what actually changes now that EA answers to three private owners instead of the public market.",
    seoTitle: "EA's $55 Billion Buyout Closed: Largest LBO in History",
    seoDescription:
      "EA's $55B buyout to PIF, Silver Lake, and Affinity Partners closed August 4, 2026, the largest leveraged buyout on record. Here's what changes.",
    seoKeywords: [
      "EA buyout closed",
      "EA $55 billion",
      "largest leveraged buyout in history",
      "EA private company",
      "PIF Silver Lake Affinity Partners EA",
    ],
    categorySlug: "gaming",
    sectionSlug: "game-industry-business",
    contentType: "analysis",
    tags: ["Pricing", "Mergers & Acquisitions", "Layoffs"],
    content: `
<p>Electronic Arts is no longer a public company. The $55 billion acquisition by a consortium of Saudi Arabia's Public Investment Fund, Silver Lake, and Jared Kushner's Affinity Partners officially closed on August 4, 2026, according to EA's own announcement. Shareholders got $210 in cash per share, a 25% premium over EA's unaffected price of $168.32. Per S&P Global, it's now the largest leveraged buyout ever completed, edging out the $32 billion TXU Energy deal that held the record since 2007.</p>

<h2>How the deal actually got funded</h2>
<p>The math behind a $55 billion take-private is worth sitting with. Roughly $36 billion came from equity, split between the three buyers plus PIF rolling over the roughly 9.9% stake it already held in EA. The other $20 billion is debt, with about $18 billion of it funded at close, all of it committed by JPMorgan Chase. Ownership now breaks down as PIF at 93.4%, Silver Lake at 5.5%, and Affinity Partners at 1.1%, according to post-close reporting.</p>
<p>The shareholder vote wasn't close. More than 201 million votes went in favor versus roughly 1.9 million against back in December 2025. Regulatory approval took longer, clearing CFIUS, U.S. antitrust review, and the EU's antitrust and Foreign Subsidies Regulation reviews before the final green light came on July 30, 2026.</p>

<h2>What actually changes day to day</h2>
<p>Less than people assume, at least on paper. Andrew Wilson stays on as CEO, and EA keeps its Redwood City headquarters. Silver Lake's Egon Durban called EA "a global leader in interactive entertainment, anchored by premier sports franchises, with accelerating revenue growth" when the deal was first announced, which is the kind of thing you say about a company you don't plan to gut immediately.</p>
<p>But going private erases the quarterly earnings calls that used to force EA to justify its FIFA, err, EA Sports FC and Battlefield spending in public. That's the real shift. A private EA carrying $20 billion in new debt has to generate enough cash to service that debt, and it no longer has to explain its cost-cutting or franchise bets to public shareholders every quarter. It answers to three owners with very long investment horizons and a debt schedule instead.</p>

<h2>The layoffs context nobody should ignore</h2>
<p>This deal isn't closing into a healthy labor market for game developers. Independent layoff trackers put 2026's confirmed industry job cuts at over 10,000 by mid-August, on pace to approach the roughly 15,600 cut in 2024's worst year, even as the industry posted around $195.6 billion in global game sales in 2025. Profits and layoffs have been rising together across the sector for two straight years now. A newly private EA carrying a heavy debt load sits squarely inside that pattern, not outside it.</p>

<h2>The verdict</h2>
<p>Call this what it is: a leveraged bet that EA Sports FC, Madden, and Battlefield generate reliable enough cash flow to carry $20 billion in debt for years. Nothing about going private makes a game studio's next release better or worse on its own. What it does is remove public scrutiny at exactly the moment the industry is cutting jobs at a record pace and calling it business as usual. Watch EA's next few rounds of studio decisions more than its next few game launches. That's where a debt-funded ownership structure actually shows up.</p>
`.trim(),
  },

  // ────────────────────────────────────────────────────────────────
  // 3. Future Tech & Science — Roman Space Telescope launch
  // Source: NASA's own press release (nasa.gov), NASA Roman blog launch
  // updates (science.nasa.gov/blogs/roman), Space.com live coverage.
  // ────────────────────────────────────────────────────────────────
  {
    slug: "nasa-roman-space-telescope-launch-dark-energy-hunt",
    title: "NASA's Roman Space Telescope Just Launched to Hunt Dark Energy",
    dek: "The Nancy Grace Roman Space Telescope lifted off on a Falcon Heavy with a field of view 100 times wider than Hubble's, on a mission to map a billion galaxies.",
    excerpt:
      "NASA's Nancy Grace Roman Space Telescope launched August 30, 2026 on a SpaceX Falcon Heavy, delivered on budget after over a decade of development. It's now three months into a million-mile trip to study dark energy, dark matter, and exoplanets at a scale Hubble was never built for.",
    seoTitle: "NASA Roman Space Telescope Launch: What It Will Do",
    seoDescription:
      "NASA's Roman Space Telescope launched August 30, 2026 on a Falcon Heavy to study dark energy and dark matter with 100x Hubble's field of view.",
    seoKeywords: [
      "Roman Space Telescope launch",
      "Nancy Grace Roman Space Telescope",
      "NASA dark energy mission",
      "Falcon Heavy Roman launch",
      "Roman Space Telescope vs Hubble",
    ],
    categorySlug: "future-tech-science",
    sectionSlug: "space-tech",
    contentType: "news",
    tags: ["Astronomy", "Performance"],
    content: `
<p>NASA's Nancy Grace Roman Space Telescope launched on August 30, 2026 at 7:26 a.m. EDT, riding a SpaceX Falcon Heavy off Launch Complex 39A at Kennedy Space Center. It's headed to the second Sun-Earth Lagrange point, a gravitationally stable spot about a million miles from Earth, on a journey NASA expects to take roughly three months. Jared Isaacman, NASA's administrator, called it "exactly the kind of success story we want to see across NASA," and it's worth pausing on why: the mission arrived ahead of schedule and on budget after more than a decade of development, which is not the norm for a flagship space telescope.</p>

<h2>Why it isn't just "another Hubble"</h2>
<p>Roman's headline number is its field of view: at least 100 times larger than Hubble's, according to NASA. Its main instrument, the Wide Field Instrument, is a 300-megapixel infrared camera built from 18 separate 4K detectors. NASA says the whole setup lets Roman survey the sky roughly 1,000 times faster than Hubble can. That's not a small upgrade. It's the difference between imaging a handful of galaxies in detail and running a genuine statistical census of a billion of them over the mission's lifetime.</p>
<p>The telescope will also generate roughly 1.4 terabytes of data every day once it's fully operational, a volume that says as much about how astronomy has changed since Hubble launched in 1990 as it does about Roman's specific instruments.</p>

<h2>What Roman is actually built to answer</h2>
<p>Three big scientific targets sit at the center of the mission: dark energy, dark matter, and a statistical census of planetary systems beyond our own. Dark energy and dark matter make up the overwhelming majority of the universe's mass and energy, and researchers still don't have a solid physical explanation for either one. Roman's approach is to observe an enormous number of galaxies and their distribution across space, then use that scale to constrain what dark energy and dark matter can and can't be, rather than trying to detect either one directly.</p>
<p>Julie McEnery, Roman's senior project scientist, and Nicky Fox, who leads NASA's Science Mission Directorate, have both been central figures shepherding the mission through its final development and launch. The broad astrophysics research Roman enables beyond its three headline goals is also expected to be significant, simply because a telescope that surveys this much sky this fast tends to turn up things nobody specifically designed it to find.</p>

<h2>What happens next</h2>
<p>Roman isn't operational yet. It's currently several weeks into a commissioning period where NASA activates and calibrates its instruments before science operations begin. NASA expects to release the telescope's first images in early 2027, once commissioning wraps and Roman settles into its orbit around L2, the same general neighborhood where the James Webb Space Telescope already operates.</p>

<h2>The verdict</h2>
<p>A space telescope hitting its cost and schedule targets is itself the story here, not just the science. Big NASA astrophysics missions have a well-earned reputation for blowing past both, and Roman didn't. Once first images land in 2027, the real test starts: whether a telescope built for speed and breadth over Hubble-style depth actually narrows down what dark energy is, or just narrows down what it isn't. Either answer would be progress. Right now, all anyone can do is wait for the data.</p>
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
  // Look up categories by slug.
  const categorySlugs = [...new Set(ARTICLES.map((a) => a.categorySlug))];
  const { data: categories, error: catErr } = await supabase
    .from("techblog_categories")
    .select("id, slug")
    .in("slug", categorySlugs);
  if (catErr || !categories) {
    throw new Error(`Could not fetch categories: ${catErr?.message}`);
  }
  const categoryBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  for (const slug of categorySlugs) {
    if (!categoryBySlug.has(slug)) {
      throw new Error(`Expected category '${slug}' not found`);
    }
  }
  console.log(`Categories resolved: ${[...categoryBySlug.entries()].map(([s, id]) => `${s}=${id}`).join(", ")}`);

  // Look up sections by slug, scoped to their category.
  const { data: sections, error: secErr } = await supabase
    .from("techblog_sections")
    .select("id, slug, category_id")
    .in("category_id", [...categoryBySlug.values()]);
  if (secErr || !sections) {
    throw new Error(`Could not fetch sections: ${secErr?.message}`);
  }
  const sectionIdByCategoryAndSlug = new Map<string, string>();
  for (const s of sections) {
    sectionIdByCategoryAndSlug.set(`${s.category_id}:${s.slug}`, s.id);
  }
  for (const article of ARTICLES) {
    const catId = categoryBySlug.get(article.categorySlug)!;
    const key = `${catId}:${article.sectionSlug}`;
    if (!sectionIdByCategoryAndSlug.has(key)) {
      throw new Error(
        `Expected section '${article.sectionSlug}' not found under category '${article.categorySlug}'`
      );
    }
  }
  console.log("All sections resolved.");

  // Upsert tags (racing with concurrent seed scripts for other categories).
  const allTagNames = [...new Set(ARTICLES.flatMap((a) => a.tags))];
  const tagIdByName = new Map<string, string>();
  for (const name of allTagNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { error: upsertErr } = await supabase
      .from("techblog_tags")
      .upsert({ name, slug }, { onConflict: "slug" });
    if (upsertErr) throw new Error(`Tag upsert failed for '${name}': ${upsertErr.message}`);

    const { data: row, error: selErr } = await supabase
      .from("techblog_tags")
      .select("id")
      .eq("slug", slug)
      .single();
    if (selErr || !row) throw new Error(`Tag select-after-upsert failed for '${name}': ${selErr?.message}`);
    tagIdByName.set(name, row.id);
    console.log(`  tag '${name}' -> ${row.id}`);
  }

  for (const article of ARTICLES) {
    console.log(`\nPublishing: ${article.title}`);
    const words = wordCount(article.content);
    const readingTime = Math.max(1, Math.round(words / 200));
    const categoryId = categoryBySlug.get(article.categorySlug)!;
    const sectionId = sectionIdByCategoryAndSlug.get(`${categoryId}:${article.sectionSlug}`)!;

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
      category_id: categoryId,
      section_id: sectionId,
      content_type: article.contentType,
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
