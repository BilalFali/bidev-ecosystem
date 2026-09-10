import { SectionHeader } from "@bidev/ui";
import Link from "next/link";
import { getAllArticles, getFeaturedArticles, getBreakingArticle } from "@/lib/articles";
import { getAllCategories } from "@/lib/categories";
import { ArticleCard } from "@/components/article/ArticleCard";
import { NewsList } from "@/components/article/NewsList";
import { TrendingList } from "@/components/article/TrendingList";
import { DataCard } from "@/components/data/DataCard";
import { NewsletterCard } from "@/components/ui/NewsletterCard";
import { getCategoryHex } from "@/lib/category-colors";
import { truncate } from "@/lib/utils";

export const revalidate = 300;

function EmptySection({ label }: { label: string }) {
  return <p className="text-sm text-ink-faint py-6">No {label} yet — check back soon.</p>;
}

// The stat headline for a Data Story card comes straight from its own
// excerpt (written and sourced by a human/editor), never invented here —
// this just pulls the first real percentage the article already cites.
function extractStat(excerpt: string): string {
  const match = excerpt.match(/\d+(\.\d+)?%/);
  return match ? match[0] : "—";
}

export default async function HomePage() {
  const [allArticles, featured, breaking, categories] = await Promise.all([
    getAllArticles(),
    getFeaturedArticles(5),
    getBreakingArticle(),
    getAllCategories(),
  ]);

  const dominant   = breaking ?? featured[0];
  const supporting = featured.filter((a) => a.slug !== dominant?.slug).slice(0, 4);
  const latest     = allArticles.slice(0, 8);
  const trending   = allArticles.slice(0, 5);

  const byCategory = (slug: string) => allArticles.filter((a) => a.categorySlug === slug);
  const ai         = byCategory("ai");
  const hardware   = [...byCategory("mobile"), ...byCategory("hardware")].slice(0, 4);
  const bigTech    = byCategory("bigtech");
  const dataStories = byCategory("data").slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* ── TOP NEWS ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {dominant ? (
          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2">
              <ArticleCard article={dominant} size="dominant" priority />
            </div>
            <div className="flex flex-col divide-y divide-border">
              {supporting.length > 0 ? (
                supporting.map((a) => <ArticleCard key={a.slug} article={a} size="compact" />)
              ) : (
                <EmptySection label="supporting stories" />
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <h1 className="font-display text-3xl text-ink mb-2">BiDev Tech</h1>
            <p className="text-ink-muted">The first stories are on their way.</p>
          </div>
        )}
      </section>

      {/* ── LATEST NEWS ──────────────────────────────────────────────────
          A dense wire-service list gets the plainest possible header: no
          eyebrow, just a title and a rule — the density of the list itself
          is what carries the section, not header decoration. */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <div className="flex items-baseline justify-between border-b border-border pb-3 mb-2">
          <h2 className="font-display text-xl text-ink">Latest</h2>
          <Link href="/news" className="text-xs text-ink-faint hover:text-ink transition-colors whitespace-nowrap">
            All stories
          </Link>
        </div>
        {latest.length > 0 ? <NewsList articles={latest} /> : <EmptySection label="stories" />}
      </section>

      {/* ── AI SECTION ───────────────────────────────────────────────────
          A left flag in the category's own color stands in for the eyebrow
          used elsewhere — the color itself is the identity mark. */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 shrink-0" style={{ backgroundColor: getCategoryHex("ai") }} aria-hidden="true" />
            <h2 className="font-display text-2xl text-ink">Artificial Intelligence</h2>
          </div>
          <Link href="/ai" className="text-xs text-ink-faint hover:text-ink transition-colors whitespace-nowrap">View all</Link>
        </div>
        {ai.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <ArticleCard article={ai[0]} size="standard" />
            </div>
            <div className="flex flex-col divide-y divide-border">
              <NewsList articles={ai.slice(1, 4)} />
            </div>
          </div>
        ) : (
          <EmptySection label="AI stories" />
        )}
      </section>

      {/* ── MOBILE & HARDWARE ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryHex("mobile") }} aria-hidden="true" />
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: getCategoryHex("hardware") }} aria-hidden="true" />
            <h2 className="font-display text-2xl text-ink">Mobile &amp; Hardware</h2>
          </div>
          <Link href="/hardware" className="text-xs text-ink-faint hover:text-ink transition-colors whitespace-nowrap">View all</Link>
        </div>
        {hardware.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hardware.map((a) => <ArticleCard key={a.slug} article={a} size="standard" />)}
          </div>
        ) : (
          <EmptySection label="hardware stories" />
        )}
      </section>

      {/* ── DATA ─────────────────────────────────────────────────────────
          The one section that's meant to look like a different instrument
          entirely: a sunken band, a mono section marker instead of a prose
          eyebrow, and cards with a --data top rule instead of the plain
          hairline border everything else uses. */}
      <section className="border-t border-b border-border bg-paper-sunken">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-end justify-between mb-6">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-xs text-data">#DATA</span>
              <h2 className="font-display text-2xl text-ink">By the Numbers</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {dataStories.length > 0 ? (
              <>
                {dataStories.map((a) => (
                  <Link key={a.slug} href={`/${a.categorySlug}/${a.slug}`} className="block h-full">
                    <DataCard value={extractStat(a.excerpt)} label={truncate(a.title, 56)} />
                  </Link>
                ))}
                <Link
                  href="/data"
                  className="flex flex-col justify-center gap-1.5 p-5 border border-border border-t-2 border-t-data bg-paper-raised hover:border-border-strong transition-colors"
                >
                  <span className="font-mono text-sm text-data">More →</span>
                  <span className="text-sm text-ink-muted">All data stories</span>
                </Link>
              </>
            ) : (
              <>
                <DataCard value="—" label="Add a real statistic in the admin" />
                <DataCard value="—" label="Add a real statistic in the admin" />
                <DataCard value="—" label="Add a real statistic in the admin" />
                <DataCard value="—" label="Add a real statistic in the admin" />
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── BIG TECH ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <div className="flex items-end justify-between mb-6">
          <SectionHeader eyebrow="Big Tech" title="Apple, Google, Microsoft & More" />
          <Link href="/bigtech" className="text-xs text-ink-faint hover:text-ink transition-colors whitespace-nowrap">View all</Link>
        </div>
        {bigTech.length > 0 ? (
          <div className="grid sm:grid-cols-3 gap-6">
            {bigTech.slice(0, 3).map((a) => <ArticleCard key={a.slug} article={a} size="standard" />)}
          </div>
        ) : (
          <EmptySection label="Big Tech stories" />
        )}
      </section>

      {/* ── TRENDING ─────────────────────────────────────────────────────
          Pure numbered density, print "most read" sidebar style — the
          numbering here is earned (it's a ranked sequence), so the header
          stays out of the way entirely. */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <h2 className="font-display text-xl text-ink mb-6">Most read this week</h2>
        <TrendingList articles={trending} />
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────── */}
      <NewsletterCard />
    </div>
  );
}
