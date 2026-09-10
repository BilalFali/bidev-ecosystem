// One-off: publishes the Apple September 2026 event recap article.
// Image slots are left as neutral grey placeholders (data URI, no network
// dependency) with descriptive alt text. The site owner will replace each
// one with a real photo via the admin editor's upload feature.
//
// Facts verified via live search on 2026-09-10:
// - MacRumors event recap (macrumors.com/2026/09/09/apple-september-2026-event-recap)
// - MacRumors pricing breakdown (macrumors.com/2026/09/09/iphone-18-pro-pricing)
// - TechCrunch / CNN / Wikipedia on the John Ternus CEO transition
//
//   npx tsx apps/tech-blog/scripts/seed-apple-september-2026-event.ts
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

const supabase = createClient(env.NEXT_PUBLIC_TECHBLOG_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// A visibly obvious "replace me" box: mid-grey fill, dashed border, a
// picture icon, and the caption text baked right into the image, so it
// can't be mistaken for a loaded photo or blend into the page background.
function placeholder(label: string, w = 1200, h = 675) {
  const words = label.match(/.{1,55}(\s|$)/g) ?? [label];
  const lines = words.slice(0, 2).map((line, i) =>
    `<text x="50%" y="${h / 2 + 70 + i * 26}" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#4A453C">${line.trim()}</text>`
  ).join("");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <rect width="${w}" height="${h}" fill="#CFC8B6"/>
    <rect x="12" y="12" width="${w - 24}" height="${h - 24}" fill="none" stroke="#8A8375" stroke-width="4" stroke-dasharray="14 10"/>
    <g transform="translate(${w / 2 - 40}, ${h / 2 - 70})" fill="none" stroke="#4A453C" stroke-width="4">
      <rect x="0" y="0" width="80" height="60" rx="4"/>
      <circle cx="20" cy="20" r="8"/>
      <path d="M0 50 L25 30 L45 45 L60 25 L80 45 L80 60 L0 60 Z" fill="#4A453C" stroke="none"/>
    </g>
    <text x="50%" y="${h / 2 + 30}" text-anchor="middle" font-family="sans-serif" font-size="24" font-weight="bold" fill="#171512">REPLACE THIS IMAGE</text>
    ${lines}
  </svg>`;
  const base64 = Buffer.from(svg, "utf8").toString("base64");
  return `<img src="data:image/svg+xml;base64,${base64}" alt="${label}" style="width:100%;height:auto;display:block;" />`;
}

const title = "Apple's September 2026 Event: Every Product Announced, and a New CEO's First Show";
const slug = "apple-september-2026-event-iphone-18-pro-iphone-duo";
const dek = "John Ternus ran his first Apple keynote as CEO, and the iPhone 18 Pro, a foldable iPhone Duo, and price hikes across the whole lineup did the talking.";
const excerpt = "Apple's September 9 event brought the iPhone 18 Pro, its first foldable iPhone, new Watches, and AirPods 5, all under CEO John Ternus for the first time since Tim Cook stepped back.";
const seoTitle = "Apple September 2026 Event: iPhone 18 Pro, iPhone Duo, Prices";
const seoDescription = "Everything Apple announced on September 9, 2026: iPhone 18 Pro pricing, the foldable iPhone Duo, new Apple Watches, AirPods 5, and John Ternus's first keynote as CEO.";
const tags = ["Cameras", "Battery Life", "Pricing", "Performance"];

const content = `
<p>Apple held its "Surprise and Shine" event on September 9, 2026, and the biggest surprise wasn't a product. It was who was on stage running the show. This was John Ternus's first keynote as Apple's CEO, eight days after Tim Cook formally stepped back to become executive chair after 15 years running the company.</p>

${placeholder("John Ternus presenting on stage at Apple's September 2026 keynote")}

<p>The products still mattered, and there were a lot of them: the iPhone 18 Pro and Pro Max, Apple's first foldable iPhone, a new Apple Watch Series 12 and Watch Ultra 4, and AirPods 5. Here's what actually changed, and what it costs.</p>

<h2>iPhone 18 Pro and Pro Max: a 2nm chip and a real price increase</h2>
<p>The iPhone 18 Pro runs on the A20 Pro, which Apple says is the first 2nm chip in a smartphone. Both the Pro and Pro Max get a variable-aperture camera system with manual controls over aperture and shutter speed, a level of manual control Apple has never given iPhone photographers before. Apple also added something it calls "Apple Reference Image," a way to verify a photo hasn't been altered, along with new texture and grain controls for people who want their photos to look less processed.</p>

${placeholder("iPhone 18 Pro Max held up on stage showing its camera system")}

<p>Both phones ship with Apple's new C2 modem, a second-generation in-house modem with different versions tuned for the Pro and Pro Max. The Pro Max gets a redesigned vapor chamber and Apple's strongest battery claim yet on an iPhone: up to 45 hours of video playback.</p>

<p>None of that came free. The iPhone 18 Pro starts at $1,199 for 256GB, up $100 from the iPhone 17 Pro. Storage tiers run $1,199 (256GB), $1,399 (512GB), $1,799 (1TB), and $2,399 (2TB). The Pro Max costs a flat $100 more at every tier: $1,299 up to $2,499 for 2TB. Pre-orders open September 12 at 5 a.m. Pacific, with phones in hand September 18.</p>

<h2>iPhone Duo: Apple's first fold, and it's not for everyone</h2>
<p>Apple's first foldable iPhone is called the iPhone Duo. It's the thinnest iPhone Apple has ever made when unfolded, carries an IP68 rating for dust and water resistance, and starts at 256GB storage in two colors. It only works with the $79 USB-C Apple Pencil, not the Pro version, which is a strange limitation for Apple's most expensive new form factor.</p>

${placeholder("iPhone Duo foldable iPhone shown open and closed")}

<p>The Duo ships with iOS 27.1 rather than the base iOS 27 build, and it won't be available right away. Pre-orders start October 16, with the phone shipping October 23, five weeks after the iPhone 18 Pro. If you wanted a foldable iPhone on day one of the event, you're still waiting over a month.</p>

<p>One casualty of the foldable's arrival: the standard iPhone 18 isn't coming this fall at all. Apple pushed it to spring 2027, alongside a rumored iPhone 18e. For now, September 2026 is a Pro-and-fold-only launch.</p>

<h2>Watch, AirPods, and what got quietly more expensive</h2>
<p>The Apple Watch Series 12 runs Apple's S11 chip, adds eight new health and fitness features and three new "Audio Intelligence" features, and gets a ceramic case option for the first time in this line. The Watch Ultra 4 gets the same feature set plus two-day battery life. Both are available for pre-order now.</p>

<p>AirPods 5 make noise cancellation standard across the entire lineup, a real upgrade for the base model. Wireless charging, on the other hand, got moved up to the premium variant only, so the cheapest AirPods 5 configuration loses a feature some buyers already had.</p>

<p>Apple also raised prices on the iPhone 16, iPhone 17, iPhone Air, and iPhone 17e, and discontinued the iPhone 17 Pro and Pro Max outright now that the 18 Pro line exists. If you were hoping last year's Pro would get cheaper as an alternative, that option is gone.</p>

<h2>iOS 27 lands September 14, with a paywall inside Siri</h2>
<p>iOS 27, iPadOS 27, macOS Golden Gate, watchOS 27, visionOS 27, and tvOS 27 all ship September 14. The most notable change is inside Siri: Apple is introducing daily usage limits on its AI features, with an "Expanded Access" tier available for an additional fee for people who hit them. iPhone Handoff between carriers launches limited to T-Mobile and Deutsche Telekom only. On a lighter note, you can now redeem an Apple Gift Card by tapping it against your iPhone over NFC instead of typing in a code.</p>

<p>Apple also introduced an AppleCare One Family Plan covering up to six people under one subscription, and extended free satellite emergency access to iPhone 14, 15, and 16 owners who were closer to losing that free window.</p>

<h2>The verdict</h2>
<p>This was a event about proving continuity, not reinventing anything. Ternus didn't come out swinging with something wild. He ran a normal Apple product cycle, on schedule, with real chip and camera upgrades on the Pro line and a genuinely new form factor in the Duo. That's the safer choice for a company mid-transition, and probably the right one.</p>

<p>The iPhone 18 Pro is a legitimate upgrade if you care about camera control and want the fastest chip Apple has shipped. The iPhone Duo is a first-generation product with a five-week-later launch date and an accessory limitation that says Apple isn't fully confident in it yet. I'd wait for the second generation of the fold and buy the Pro now if you need a phone today.</p>
`.trim();

async function main() {
  const { data: category } = await supabase.from("techblog_categories").select("id").eq("slug", "bigtech").single();
  if (!category) throw new Error("bigtech category not found");

  const { data: section } = await supabase
    .from("techblog_sections")
    .select("id")
    .eq("category_id", category.id)
    .eq("slug", "company-strategy")
    .single();
  if (!section) throw new Error("company-strategy section not found");

  const tagIds: string[] = [];
  for (const name of tags) {
    const slugified = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const { data: existing } = await supabase.from("techblog_tags").select("id").eq("slug", slugified).maybeSingle();
    if (existing) {
      tagIds.push(existing.id);
    } else {
      const { data: inserted, error } = await supabase.from("techblog_tags").insert({ name, slug: slugified }).select("id").single();
      if (error || !inserted) throw new Error(`Tag insert failed for ${name}: ${error?.message}`);
      tagIds.push(inserted.id);
    }
  }

  const words = content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  const row = {
    title, slug, dek, content, excerpt,
    status: "published" as const,
    category_id: category.id,
    section_id: section.id,
    content_type: "news" as const,
    seo_title: seoTitle,
    seo_description: seoDescription,
    seo_keywords: ["Apple September 2026 event", "iPhone 18 Pro price", "iPhone Duo foldable iPhone", "John Ternus Apple CEO", "iPhone 18 Pro release date"],
    reading_time: readingTime,
    breaking: true,
    published_at: new Date().toISOString(),
  };

  const { data: existingArticle } = await supabase.from("techblog_articles").select("id").eq("slug", slug).maybeSingle();

  let articleId: string;
  if (existingArticle) {
    const { data: updated, error } = await supabase.from("techblog_articles").update(row).eq("id", existingArticle.id).select("id").single();
    if (error || !updated) throw new Error(`Update failed: ${error?.message}`);
    articleId = updated.id;
    console.log(`Updated existing article ${articleId}`);
  } else {
    const { data: inserted, error } = await supabase.from("techblog_articles").insert(row).select("id").single();
    if (error || !inserted) throw new Error(`Insert failed: ${error?.message}`);
    articleId = inserted.id;
    console.log(`Inserted new article ${articleId}, words=${words}, reading_time=${readingTime}min`);
  }

  await supabase.from("techblog_article_tags").delete().eq("article_id", articleId);
  await supabase.from("techblog_article_tags").insert(tagIds.map((tag_id) => ({ article_id: articleId, tag_id })));
  console.log(`Linked tags: ${tags.join(", ")}`);
  console.log("Done. Slug:", slug);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
