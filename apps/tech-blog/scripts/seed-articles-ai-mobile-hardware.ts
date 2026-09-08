// One-off seed: publishes 3 real articles, one each for AI, Mobile, and
// Hardware, directly into the tech-blog Supabase project, bypassing the
// admin UI (there is no admin login available in this environment).
//
// All figures were verified via live web search/fetch on 2026-09-08 against
// named sources (Anthropic's own announcement, Apple's and Samsung's official
// spec pages, and NoobFeed's Panther Lake vs Ryzen AI Max Plus benchmarks).
// See the `content` bodies below for the specific citations.
//
//   npx tsx apps/tech-blog/scripts/seed-articles-ai-mobile-hardware.ts
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
  categorySlug: "ai" | "mobile" | "hardware";
  sectionSlug: string;
  contentType: string;
  tags: string[];
  content: string; // HTML — rendered via dangerouslySetInnerHTML by the article page
}

const ARTICLES: ArticleSeed[] = [
  // ────────────────────────────────────────────────────────────────
  // 1. AI — News — AI Models
  // Source: Anthropic's own announcement (anthropic.com/claude-fable-and-
  // mythos-5-1) plus MacRumors and VentureBeat coverage, all published
  // September 1, 2026.
  // ────────────────────────────────────────────────────────────────
  {
    slug: "claude-fable-5-1-mythos-5-1-anthropic",
    title: "Anthropic Ships Claude Fable 5.1, Cuts Agent Costs Up to 45%",
    dek: "The new model beats Fable 5 on every published benchmark and comes with cheaper caching, while a restricted sibling model targets cybersecurity and life-sciences work.",
    excerpt:
      "Anthropic released Claude Fable 5.1 and the access-gated Claude Mythos 5.1 on September 1, 2026. Fable 5.1 more than doubles its predecessor's score on Terminal-Bench-Science and cuts cache-read pricing by 75%.",
    seoTitle: "Claude Fable 5.1: Benchmarks, Pricing, and What's New",
    seoDescription:
      "Anthropic's Claude Fable 5.1 beats Fable 5 on every published benchmark and cuts agentic workload costs up to 45%. Here's what actually changed.",
    seoKeywords: [
      "Claude Fable 5.1",
      "Anthropic new model 2026",
      "Claude Mythos 5.1",
      "Claude Fable 5.1 benchmarks",
      "Claude Fable 5.1 pricing",
    ],
    categorySlug: "ai",
    sectionSlug: "ai-models",
    contentType: "news",
    tags: ["LLM", "Generative AI", "Pricing"],
    content: `
<p>Anthropic released <strong>Claude Fable 5.1</strong> on September 1, 2026, three months after Fable 5, along with a more tightly access-gated sibling called <strong>Claude Mythos 5.1</strong>. Anthropic is calling them the company's most capable models yet for coding and knowledge work, and the benchmark numbers back that framing up more than most release-day claims do.</p>

<h2>What actually improved</h2>
<p>The headline number is Terminal-Bench-Science 0.1, a test of agentic scientific research tasks. Fable 5.1 scored 52.6% there, more than double Fable 5's 24.7% and well ahead of Opus 5's 29.0%. On Terminal-Bench 4.0, a broader coding and terminal-use benchmark, Fable 5.1 hit 55.8%. On Humanity's Last Exam, a notoriously hard general-knowledge test, it scored 60.9% without tool use and 65.0% with tools enabled.</p>
<p>Those aren't small gains dressed up with a version bump. Anthropic says Fable 5.1 finishes ahead of Opus 5 on every category it published results for, which is a real claim worth checking against independent evals as they come in over the next few weeks.</p>

<h2>Cheaper, not just faster</h2>
<p>Pricing on paper hasn't moved. Input tokens are still $10 per million and output tokens $50 per million, the same list price as Fable 5. What changed is cache-read pricing, cut 75% to $0.25 per million tokens. For a typical workload that's roughly a 25% cost reduction. For heavily agentic workloads, the kind that lean hard on cached context across long multi-step tasks, Anthropic says the savings run up to 45%. If your bill is dominated by an agent re-reading the same codebase or document set turn after turn, this is the part of the release that actually shows up on an invoice.</p>

<h2>Two models, two audiences</h2>
<p>Fable 5.1 is generally available today through the Claude API as <code>claude-fable-5-1</code>, plus Claude.ai, Claude Code, Claude Enterprise, and the usual cloud triumvirate of AWS, Google Cloud, and Microsoft Azure. Mythos 5.1 is the same underlying model with different safeguards, and it's not generally available. Anthropic is routing it only to vetted cybersecurity professionals through a Cyber Verification Program and to life-sciences researchers through a separate verification program, specifically because those fields need a model willing to discuss exploit mechanics or pathogen biology in ways Anthropic doesn't want available to anyone who signs up for an API key.</p>
<p>The safeguard tuning on the generally-available Fable 5.1 also got more precise, not just looser. Anthropic says biology-related safety triggers fire 85% less often on benign requests, and cybersecurity false positives dropped around 60%, while still restricting offensive exploit generation. That's the harder problem in AI safety engineering: not being cautious, but being cautious about the right things without blocking a security researcher trying to write a proof-of-concept for a bug they already found.</p>

<h2>The verdict</h2>
<p>A doubling on a science-agent benchmark and a real double-digit cost cut in the same release is a genuinely strong showing, not just an incremental point release despite the ".1" naming. If you're already building on Fable 5, swapping to 5.1 looks like a straightforward upgrade with no price increase and better numbers across the board. The bigger question is whether Terminal-Bench-Science and CursorBench scores translate into fewer failed agent runs in production, and that's something only a few more months of real usage will answer.</p>
`.trim(),
  },

  // ────────────────────────────────────────────────────────────────
  // 2. Mobile — Comparison — Smartphones
  // Source: Apple's official specs page (apple.com/iphone-17/specs) and
  // buy page pricing, Samsung's official US specs/buy pages for Galaxy
  // S25 Ultra, cross-checked against PhoneArena's Geekbench figures.
  // ────────────────────────────────────────────────────────────────
  {
    slug: "iphone-17-vs-galaxy-s25-ultra-comparison",
    title: "iPhone 17 vs Galaxy S25 Ultra: Which One Actually Wins?",
    dek: "One costs $500 less and still keeps up in daily use. The other has a bigger screen, a 200MP camera, and a price tag to match.",
    excerpt:
      "The iPhone 17 starts at $799 and the Galaxy S25 Ultra starts at $1,299.99. Here's what that $500 gap actually buys you in display, camera, and battery, using both companies' own published specs.",
    seoTitle: "iPhone 17 vs Galaxy S25 Ultra: Specs, Price, Camera Compared",
    seoDescription:
      "iPhone 17 starts at $799, Galaxy S25 Ultra at $1,299.99. Compare display, camera, battery, and performance using official specs.",
    seoKeywords: [
      "iPhone 17 vs Galaxy S25 Ultra",
      "iPhone 17 price",
      "Galaxy S25 Ultra price",
      "iPhone 17 camera specs",
      "best phone 2026",
    ],
    categorySlug: "mobile",
    sectionSlug: "smartphones",
    contentType: "comparison",
    tags: ["Cameras", "Battery Life", "Pricing", "Performance"],
    content: `
<p>The iPhone 17 starts at $799. The Galaxy S25 Ultra starts at $1,299.99. That's not a small gap, it's an entire extra mid-range phone's worth of money, and it frames everything else in this comparison. The question isn't which phone is "better" in the abstract. It's whether Samsung's extra $500 actually buys $500 of real difference.</p>

<h2>Display: bigger versus sharper trade-offs</h2>
<p>Apple's own spec sheet puts the iPhone 17 at a 6.3-inch Super Retina XDR OLED display, 2622-by-1206 resolution at 460 ppi, with ProMotion adaptive refresh up to 120Hz. Samsung's Galaxy S25 Ultra goes bigger at 6.9 inches with a Dynamic AMOLED 2X panel. If you want the biggest screen you can hold, Samsung wins outright. If you want the more pocketable phone that still runs at 120Hz, the iPhone 17 doesn't give up much to get there.</p>

<h2>Camera: resolution isn't the whole story</h2>
<p>This is where the spec sheets look the most lopsided. The Galaxy S25 Ultra's rear camera array is 200MP (f/1.7) main, plus 50MP (f/3.4) and 50MP (f/1.9) telephoto units, and a 10MP (f/2.4) sensor, all according to Samsung's own listing. The iPhone 17 runs a 48MP Dual Fusion system, a 48MP main at f/1.6 and a 48MP ultra-wide at f/2.2, per Apple's specs page.</p>
<p>A 200MP sensor sounds like an easy win on paper, but Samsung's S25 Ultra shoots binned 12MP or 50MP shots in normal use, not full 200MP files, and Apple's computational pipeline on the 48MP Fusion Main sensor holds up well against it in daylight. Where Samsung actually pulls ahead is optical reach: two dedicated telephoto lenses versus none on the standard iPhone 17. If zoom photography matters to you, that's the real differentiator, not the megapixel count on the box.</p>

<h2>Battery and everyday performance</h2>
<p>Samsung's S25 Ultra packs a 5,000mAh battery rated for up to 31 hours of use. Apple doesn't publish a raw mAh figure for the iPhone 17 but rates it for up to 30 hours of video playback, close enough that neither phone has a decisive real-world edge here. On raw CPU benchmarks, PhoneArena's Geekbench 6 testing put the Galaxy S25 Ultra's Snapdragon 8 Elite ahead of the iPhone 17 Pro Max's A19 Pro on multi-core, 10,105 versus 9,921. That's a narrow enough gap that you won't feel it opening apps or switching between them, and the base iPhone 17 runs the standard A19, not the Pro variant, so the comparison there is even closer to a wash in daily use.</p>

<h2>The verdict</h2>
<p>If you're chasing the biggest screen and the most flexible zoom camera and you don't blink at $1,299.99, the Galaxy S25 Ultra is the more capable phone, full stop. But for most people the iPhone 17 is the smarter buy. It undercuts the S25 Ultra by $500, matches it closely enough on the things that matter day to day, and doesn't ask you to justify a telephoto lens you might use twice a month. Samsung is selling a specialist's phone at a specialist's price. Apple is selling the phone that fits in more pockets and more budgets.</p>
`.trim(),
  },

  // ────────────────────────────────────────────────────────────────
  // 3. Hardware — Comparison — Laptops & PCs
  // Source: NoobFeed's Panther Lake vs Ryzen AI Max Plus benchmark
  // breakdown (Geekbench 6, 3DMark Time Spy, Geekbench Vulkan figures),
  // cross-checked against Notebookcheck's and Club386's coverage of the
  // Intel/AMD Panther Lake pricing and positioning dispute.
  // ────────────────────────────────────────────────────────────────
  {
    slug: "intel-panther-lake-vs-amd-ryzen-ai-max-plus",
    title: "Intel Panther Lake vs AMD Ryzen AI Max Plus: Who Actually Wins?",
    dek: "Intel's new Core Ultra X9 388H beats AMD on raw CPU scores and power draw, but Ryzen AI Max Plus still holds the graphics lead that matters for the priciest laptops in this class.",
    excerpt:
      "Intel's flagship Panther Lake chip, the Core Ultra X9 388H, outscores AMD's Ryzen AI Max Plus 395 on Geekbench 6 while running at a lower 45W TDP. AMD keeps a clear integrated-graphics lead. Here's how the numbers actually break down.",
    seoTitle: "Panther Lake vs Ryzen AI Max Plus: Benchmarks Compared",
    seoDescription:
      "Intel Core Ultra X9 388H vs AMD Ryzen AI Max Plus 395: real Geekbench and 3DMark numbers, TDP, and which laptop chip actually wins where.",
    seoKeywords: [
      "Panther Lake vs Ryzen AI Max Plus",
      "Core Ultra X9 388H benchmarks",
      "Intel Panther Lake review",
      "best laptop CPU 2026",
      "Ryzen AI Max Plus 395",
    ],
    categorySlug: "hardware",
    sectionSlug: "laptops-pcs",
    contentType: "comparison",
    tags: ["Performance", "Processors"],
    content: `
<p>Intel's Panther Lake generation is the company's first consumer chip built on its own 18A process node, and the flagship part, the Core Ultra X9 388H, is now putting up numbers that actually challenge AMD's Ryzen AI Max Plus 395 head-on instead of just chasing it. That's a change worth paying attention to if you're shopping for a premium Windows laptop this year.</p>

<h2>CPU: Intel takes the lead, and does it at lower power</h2>
<p>On Geekbench 6, the Core Ultra X9 388H scores over 3,000 in single-core and roughly 17,687 in multi-core, according to benchmark testing compiled by NoobFeed. That's not just a generational bump, it's 15% to 21% faster than Intel's own previous flagship, the Core Ultra 9 285H. The more interesting number is the TDP it takes to get there: 45W, compared to the Ryzen AI Max Plus 395's 55W. Intel is winning on raw CPU throughput and doing it with a lower power ceiling, which is exactly the combination that matters most in a thin laptop chassis with limited cooling headroom.</p>

<h2>Graphics: AMD still has the harder lead</h2>
<p>CPU cores aren't the whole story on these chips, and this is where AMD pushes back. AMD's Radeon 8060S integrated graphics, paired with the Ryzen AI Max Plus 395, still holds a real lead over Intel's Arc-based iGPUs in this class, according to the same testing. Intel's mid-range Core Ultra X7 358H scores around 6,800 in 3DMark Time Spy at 65W, a 72% jump over the previous-gen Core Ultra 7 255H, which shows real progress, but it's progress against Intel's own last generation, not proof of parity with AMD. On Geekbench's Vulkan compute test, the Core Ultra 7 366H hit roughly 26,000, about 26% ahead of AMD's more modest Radeon 840M at 22,000, but that's a lower-tier AMD part, not the Radeon 8060S flagship pairing.</p>
<p>The honest read: Intel closed the graphics gap against its own prior generation dramatically, and beats AMD's lower-end integrated graphics, but AMD's top integrated-GPU pairing in the Ryzen AI Max Plus 395 remains the one to beat if gaming or GPU compute on integrated graphics alone is the priority.</p>

<h2>Price and where these chips actually land</h2>
<p>This isn't a cheap-laptop fight either. AMD's Ryzen AI Max Plus 395 currently ships in machines like the Asus ROG Flow Z13 at $2,299.99, and early Panther Lake laptops are landing in a similar range, reportedly up to $2,400 for higher-end configurations. Both companies are clearly targeting the same premium buyer, not competing on budget positioning.</p>

<h2>The verdict</h2>
<p>If your workload is CPU-bound, code compilation, video encoding, general multitasking, the Core Ultra X9 388H is the better chip right now, and it gets there sipping less power, which should translate into better battery life in a laptop built around it. If integrated graphics performance is what you actually care about, gaming without a discrete GPU, GPU-accelerated creative work, AMD's Ryzen AI Max Plus 395 still has the edge and probably will until Intel's next Xe iGPU generation. Neither chip is a clean sweep, and anyone telling you otherwise is running one benchmark and calling it a verdict.</p>
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
  // Look up categories.
  const { data: categories, error: catErr } = await supabase
    .from("techblog_categories")
    .select("id, slug")
    .in("slug", ["ai", "mobile", "hardware"]);
  if (catErr || !categories) {
    throw new Error(`Could not fetch categories: ${catErr?.message}`);
  }
  const categoryIdBySlug = new Map(categories.map((c) => [c.slug, c.id]));
  for (const slug of ["ai", "mobile", "hardware"]) {
    if (!categoryIdBySlug.has(slug)) {
      throw new Error(`Expected category '${slug}' not found`);
    }
  }
  console.log(
    `Categories: ${[...categoryIdBySlug.entries()].map(([s, id]) => `${s}=${id}`).join(", ")}`
  );

  // Look up sections for those categories.
  const { data: sections, error: secErr } = await supabase
    .from("techblog_sections")
    .select("id, slug, category_id")
    .in("category_id", [...categoryIdBySlug.values()]);
  if (secErr || !sections) {
    throw new Error(`Could not fetch sections: ${secErr?.message}`);
  }
  const sectionIdBySlug = new Map(sections.map((s) => [s.slug, s.id]));
  for (const a of ARTICLES) {
    if (!sectionIdBySlug.has(a.sectionSlug)) {
      throw new Error(`Expected section '${a.sectionSlug}' not found`);
    }
  }
  console.log(`Sections found: ${[...sectionIdBySlug.keys()].join(", ")}`);

  // Upsert tags (race-safe: two other agents seed different categories
  // concurrently and may be touching shared tags like "Performance").
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
    if (selErr || !row) throw new Error(`Tag select failed for '${name}': ${selErr?.message}`);
    tagIdByName.set(name, row.id);
    console.log(`  tag '${name}' -> ${row.id}`);
  }

  for (const article of ARTICLES) {
    console.log(`\nPublishing: ${article.title}`);
    const words = wordCount(article.content);
    const readingTime = Math.max(1, Math.round(words / 200));
    const categoryId = categoryIdBySlug.get(article.categorySlug)!;
    const sectionId = sectionIdBySlug.get(article.sectionSlug)!;

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
