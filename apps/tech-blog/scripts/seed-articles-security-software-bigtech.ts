// One-off seed: publishes 3 real articles, one each for Security, Software,
// and Big Tech, directly into the tech-blog Supabase project (no admin
// login available in this environment). Mirrors the pattern in
// seed-data-stories.ts.
//
// All figures were verified via live web search on 2026-09-08 against named
// sources: SonicWall's own advisory + CISA KEV + Rapid7/SecurityWeek/
// BleepingComputer coverage (Security); Microsoft's Windows IT Pro Blog +
// Windows Central/Windows Latest coverage of KB5120998 and 26H2 (Software);
// CNBC, court filings on courthousenews.com, and itechguides.com's tracker
// of the DC Circuit docket (Big Tech). See inline comments per article.
//
//   npx tsx apps/tech-blog/scripts/seed-articles-security-software-bigtech.ts
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

type ContentType =
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

interface ArticleSeed {
  slug: string;
  title: string;
  dek: string;
  excerpt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  categorySlug: "security" | "software" | "bigtech";
  sectionSlug: string;
  contentType: ContentType;
  tags: string[];
  content: string; // HTML — rendered via dangerouslySetInnerHTML by the article page
}

const ARTICLES: ArticleSeed[] = [
  // ────────────────────────────────────────────────────────────────
  // 1. Security — Breaches & Vulnerabilities — News
  // Sources: SonicWall's own advisory SNWLID-2026-0016; CISA KEV catalog
  // additions (Sept 2, 2026); Rapid7, SecurityWeek, BleepingComputer, The
  // Hacker News, and Help Net Security coverage of CVE-2026-83548 /
  // CVE-2026-83549, all published Sept 1-3, 2026.
  // ────────────────────────────────────────────────────────────────
  {
    slug: "sonicwall-sma1000-zero-days-cve-2026-83548-83549",
    title: "SonicWall's VPN Boxes Are Under Attack Again, and This Time It's a CVSS 10",
    dek: "Two chained zero-days let an attacker skip the login screen entirely on SonicWall's SMA1000 appliances, and SonicWall says the attacks started before the patch existed.",
    excerpt:
      "CVE-2026-83548 and CVE-2026-83549 let attackers chain an unauthenticated SSRF flaw with a command injection bug to get remote code execution on SonicWall SMA1000 appliances. CISA added both to its Known Exploited Vulnerabilities catalog within a day of disclosure.",
    seoTitle: "SonicWall SMA1000 Zero-Days: CVE-2026-83548 Explained",
    seoDescription:
      "SonicWall disclosed two actively exploited SMA1000 zero-days, CVE-2026-83548 and CVE-2026-83549. Here's what they do and how to patch.",
    seoKeywords: [
      "SonicWall SMA1000 vulnerability",
      "CVE-2026-83548",
      "CVE-2026-83549",
      "SonicWall zero-day",
      "CISA known exploited vulnerabilities",
    ],
    categorySlug: "security",
    sectionSlug: "breaches-vulnerabilities",
    contentType: "news",
    tags: ["Privacy", "Zero-Day"],
    content: `
<p>SonicWall disclosed two zero-day vulnerabilities in its SMA1000 series appliances on September 1, 2026, and said both were already being exploited before a fix existed. Chained together, they let an attacker with no credentials at all reach remote code execution on the box that's supposed to be guarding the network's front door.</p>

<h2>What the two bugs actually do</h2>
<p><strong>CVE-2026-83548</strong> is a pre-authentication server-side request forgery flaw in the SMA1000 Appliance Work Place interface, and it carries the maximum CVSS score: 10.0. An attacker doesn't need to log in. They just need the appliance reachable, and SSRF lets them reach internal functionality they were never supposed to touch.</p>
<p><strong>CVE-2026-83549</strong> is an OS command injection bug in the Appliance Management Console, rated 7.8. On its own it needs an authenticated administrator session. That's the catch, and the danger: chain it with the SSRF flaw first, and an attacker can reach the management console's command injection path without ever authenticating, landing on full remote code execution on a fully patched-looking appliance.</p>

<h2>Confirmed exploitation, not just a theoretical bug</h2>
<p>This isn't a "responsible disclosure before anyone notices" story. SonicWall confirmed active exploitation against SMA1000 6210, 7210, and 8200v models before it shipped a fix. CISA added both CVEs to its Known Exploited Vulnerabilities catalog on September 2, one day after disclosure, and set a remediation deadline of September 5 for federal agencies, an unusually tight three-day window that signals how seriously CISA is treating it.</p>
<p>Coverage from multiple security outlets, including SecurityWeek and Help Net Security, frames this as at least the third exploited zero-day chain to hit the SMA1000 line since December. SonicWall's SMA appliances, remote access VPN gateways sitting at the network edge, have become a recurring target precisely because that's what they're for: internet-facing, always-on, and holding the keys to whatever's behind them.</p>

<h2>What to do about it</h2>
<p>SonicWall's fix ships as platform hotfixes 12.4.3-03526 and 12.5.0-02952, or a newer supported hotfix for your specific model. If you're running SMA1000 hardware and haven't patched since September 1, treat this as urgent, not routine. Given that exploitation predated the patch, a straightforward update isn't necessarily enough on its own. Anyone running these appliances should also be checking logs for signs of prior compromise, not just applying the fix and moving on.</p>

<h2>The verdict</h2>
<p>A CVSS 10 pre-auth bug on an internet-facing VPN appliance is about as bad as this category of vulnerability gets, and the fact that it's the third such chain on this product line in under a year says the underlying design keeps producing this class of bug. If your organization runs SMA1000 hardware, patch today and assume the worst about anything internet-facing until you've confirmed otherwise.</p>
`.trim(),
  },

  // ────────────────────────────────────────────────────────────────
  // 2. Software — Operating Systems — News
  // Sources: Microsoft's own Windows IT Pro Blog post "Get ready for
  // Windows 11, version 26H2"; Windows Central and Windows Latest coverage
  // of KB5120998 (build 26200.9278), rolled out Sept 8, 2026; PCWorld and
  // WinCentral coverage of the 26H2 timeline.
  // ────────────────────────────────────────────────────────────────
  {
    slug: "windows-11-26h2-kb5120998-september-2026-update",
    title: "Windows 11's Big Fall Update Is Deliberately Boring, and Microsoft Says That's the Point",
    dek: "KB5120998 just rolled out with a more flexible taskbar and Start menu, and it's a preview of the same small, low-drama update Microsoft plans to ship as 26H2 in October.",
    excerpt:
      "Microsoft rolled out KB5120998 on September 8, 2026, bringing a resizable, repositionable taskbar, a customizable Start menu, and search changes to Windows 11. It's a preview of version 26H2, an enablement-package update Microsoft is deliberately keeping small.",
    seoTitle: "Windows 11 26H2: Release Date and What's Actually New",
    seoDescription:
      "Windows 11 26H2 arrives around October 2026 as a small enablement update. Here's what KB5120998 and 26H2 actually change.",
    seoKeywords: [
      "Windows 11 26H2",
      "Windows 11 26H2 release date",
      "KB5120998",
      "Windows 11 September 2026 update",
      "Windows 11 taskbar customization",
    ],
    categorySlug: "software",
    sectionSlug: "operating-systems",
    contentType: "news",
    tags: ["Performance", "User Experience"],
    content: `
<p>Microsoft began rolling out KB5120998 on September 8, 2026, bringing Windows 11 builds 26200.9278 and 26100.9278 to PCs enrolled in the optional preview channel. The headline changes are small and mostly cosmetic: a taskbar you can finally resize and move to any edge of the screen, and a Start menu you can resize, reorganize, or strip down to hide your name and profile picture. None of it sounds dramatic, and according to Microsoft, that's exactly the intent.</p>

<h2>What's actually changing this month</h2>
<p>The taskbar update lets you shrink it to reclaim screen space or reposition it away from the bottom edge, something Windows users have been requesting since Windows 11 first locked the taskbar to the bottom in 2021. The Start menu gets similar treatment: resize it, pick which sections show up, and hide personal details if you're screen-sharing or presenting.</p>
<p>Windows Search also picks up a genuinely useful option: you can now disable Bing and Microsoft Store results from cluttering local search on the Start menu, a complaint that's followed Windows Search for years. Rounding it out are a redesigned File Explorer context menu, a refreshed Magnifier tool, and a batch of new emoji.</p>

<h2>Why this is really a preview of 26H2</h2>
<p>KB5120998 isn't a one-off patch. It's Microsoft testing features ahead of Windows 11, version 26H2, expected to arrive around October 2026. Per Microsoft's own Windows IT Pro Blog, 26H2 ships on the same underlying platform as 25H2 and 24H2, a shared release codenamed Germanium. Practically, that means 26H2 lands as a small enablement package rather than a full reinstall: a short download, a quick install, and none of the driver-compatibility risk that comes with a bigger platform jump.</p>
<p>Windows watchers, including Windows Latest and PCWorld, have described 26H2 as intentionally quiet after several years of more disruptive Windows 11 changes. Microsoft hasn't committed to an exact release date beyond "this fall," but the pattern from recent years, 25H2 shipped in late September and both 24H2 and 23H2 landed in October, points to a similar window this year.</p>

<h2>The one thing that isn't cosmetic</h2>
<p>Installing 26H2 resets the Windows support lifecycle clock on your device, same as every annual feature update before it. If you're on 24H2 or 25H2 already, taking 26H2 when it arrives buys you more time before your PC falls out of support, even though the visible changes are modest.</p>

<h2>The verdict</h2>
<p>A resizable taskbar sounds trivial until you've spent four years wanting one. Combined with a support-lifecycle reset that costs nothing to take, there's no real reason to skip 26H2 when it lands. This is a maintenance release wearing a feature update's name tag, and for once that's a compliment.</p>
`.trim(),
  },

  // ────────────────────────────────────────────────────────────────
  // 3. Big Tech — Regulation & Antitrust — Analysis
  // Sources: CNBC's Dec 5, 2025 report on Judge Mehta's finalized remedies;
  // court filings on courthousenews.com (DC Circuit Nos. 26-5023, 26-5047,
  // 26-5049); itechguides.com's tracker of the appeal timeline; DocketAlarm
  // coverage of the DC Circuit scheduling order; tech-insider.org coverage
  // of the EU's Android fine becoming final.
  // ────────────────────────────────────────────────────────────────
  {
    slug: "google-search-antitrust-appeal-dc-circuit-2026",
    title: "Google's Search Antitrust Case Didn't End in 2025. It Just Moved to a New Courtroom.",
    dek: "A year after a federal judge ruled Google ran an illegal search monopoly, the real fight over what Google actually has to change is now happening at the DC Circuit, and neither side is happy with the remedies.",
    excerpt:
      "Judge Amit Mehta's September 2025 remedies ruling against Google became final in December, but both Google and the Justice Department appealed. Google wants the data-sharing rules thrown out; the DOJ wants Chrome or Android divested. Here's where the case actually stands.",
    seoTitle: "Google Antitrust Appeal 2026: Where the DC Circuit Case Stands",
    seoDescription:
      "Google and the DOJ are both appealing Judge Mehta's search antitrust remedies. Here's the real status of the DC Circuit case in 2026.",
    seoKeywords: [
      "Google antitrust appeal 2026",
      "Google search monopoly case",
      "Judge Mehta Google remedies",
      "DC Circuit Google appeal",
      "Google Chrome divestiture",
    ],
    categorySlug: "bigtech",
    sectionSlug: "regulation-antitrust",
    contentType: "analysis",
    tags: ["Privacy", "Open Source"],
    content: `
<p>In September 2025, Judge Amit Mehta of the US District Court for the District of Columbia ordered a set of remedies against Google following his earlier ruling that the company illegally maintained a monopoly in online search. He stopped short of forcing Google to sell off Chrome, but he banned exclusive default-placement contracts, the kind of deal that made Google the automatic search engine on countless phones and browsers, and ordered Google to license some of its search data to rival companies. That ruling became legally final in December 2025. It also satisfied nobody, and a year later the real argument over what Google has to do is playing out at the US Court of Appeals for the District of Columbia Circuit.</p>

<h2>Two appeals pulling in opposite directions</h2>
<p>Google filed its notice of appeal on January 16, 2026, challenging the data-sharing requirements and the technical committee Judge Mehta set up to oversee compliance. The Justice Department, joined by 38 state attorneys general, filed a cross-appeal on February 3 arguing the remedies didn't go far enough, and it's still pushing for what Mehta rejected: a forced breakup that would split off Chrome or Android.</p>
<p>The two sides are now working through a formal briefing schedule. Google filed its opening brief on May 22. Court records show Google's reply brief is due September 29, 2026. The cases, consolidated under docket numbers 26-5023, 26-5047, and 26-5049, haven't had an oral argument date set yet, though legal trackers following the docket expect one in late 2026 or early 2027.</p>

<h2>The remedies are live, but barely</h2>
<p>Part of Mehta's order already took effect in February 2026, meaning Google is technically operating under the new rules while the appeal plays out. In practice, implementation has been slow. As of early August, no public filing confirmed that any rival search company had actually started receiving the search data or syndication access the order requires. Setting up a compliance framework this complex apparently takes longer than winning the case that created it.</p>

<h2>Meanwhile, in Brussels</h2>
<p>Google's antitrust exposure isn't limited to the US case. A separate European Commission fine against Alphabet, roughly 4.67 billion euros over Android's bundling practices, became legally final on July 2, 2026, after years of its own appeals process. It's a reminder that Google is fighting a version of this same fight on two continents at once, with different regulators reaching similar conclusions about the same underlying behavior: using platform control to lock out competitors.</p>

<h2>The verdict</h2>
<p>Nobody who won anything in the original ruling is treating it as over, and that tells you the real outcome is still undecided. Google's appeal, if it succeeds, could gut the data-sharing rules before any rival benefits from them. The DOJ's cross-appeal, if it succeeds, could force exactly the kind of structural breakup Mehta avoided. Watch the September 29 reply brief and whenever the DC Circuit finally sets an oral argument date. Until then, this case isn't resolved. It's paused.</p>
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
  console.log(`Looking up categories: ${categorySlugs.join(", ")}...`);
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
  console.log(`  found: ${[...categoryBySlug.entries()].map(([s, id]) => `${s}=${id}`).join(", ")}`);

  // Look up sections by category_id, then match by slug.
  const { data: sections, error: secErr } = await supabase
    .from("techblog_sections")
    .select("id, slug, category_id")
    .in("category_id", [...categoryBySlug.values()]);
  if (secErr || !sections) {
    throw new Error(`Could not fetch sections: ${secErr?.message}`);
  }
  const sectionIdByKey = new Map(sections.map((s) => [`${s.category_id}:${s.slug}`, s.id]));
  for (const article of ARTICLES) {
    const catId = categoryBySlug.get(article.categorySlug)!;
    const key = `${catId}:${article.sectionSlug}`;
    if (!sectionIdByKey.has(key)) {
      throw new Error(
        `Expected section '${article.sectionSlug}' not found under category '${article.categorySlug}'`
      );
    }
  }
  console.log("  all sections resolved");

  // Upsert tags (concurrent seeding by other agents may be racing on shared
  // tag names like "Performance" or "Privacy" — upsert on slug avoids that).
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
    const sectionId = sectionIdByKey.get(`${categoryId}:${article.sectionSlug}`)!;

    // Idempotent by slug.
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
