import { SectionHeader } from "@bidev/ui";
import Link from "next/link";
import { getAllArticles, getFeaturedArticles, getBreakingArticle } from "@/lib/articles";
import { getAllCategories } from "@/lib/categories";
import { ArticleCard } from "@/components/article/ArticleCard";
import { NewsList } from "@/components/article/NewsList";
import { TrendingList } from "@/components/article/TrendingList";
import { DataCard } from "@/components/data/DataCard";
import { NewsletterCard } from "@/components/ui/NewsletterCard";

export const revalidate = 300;

function EmptySection({ label }: { label: string }) {
  return <p className="text-sm text-ink-faint py-6">No {label} yet — check back soon.</p>;
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
  const ai       = byCategory("ai");
  const hardware = [...byCategory("mobile"), ...byCategory("hardware")].slice(0, 4);
  const bigTech  = byCategory("bigtech");

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

      {/* ── LATEST NEWS ──────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <SectionHeader eyebrow="Latest" title="Latest News" />
        <div className="mt-6">
          {latest.length > 0 ? <NewsList articles={latest} /> : <EmptySection label="stories" />}
        </div>
      </section>

      {/* ── AI SECTION ───────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <div className="flex items-end justify-between mb-6">
          <SectionHeader eyebrow="AI" title="Artificial Intelligence" />
          <Link href="/ai" className="text-xs text-ink-faint hover:text-ink transition-colors whitespace-nowrap">View all →</Link>
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
          <SectionHeader eyebrow="Devices" title="Mobile & Hardware" />
          <Link href="/hardware" className="text-xs text-ink-faint hover:text-ink transition-colors whitespace-nowrap">View all →</Link>
        </div>
        {hardware.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {hardware.map((a) => <ArticleCard key={a.slug} article={a} size="standard" />)}
          </div>
        ) : (
          <EmptySection label="hardware stories" />
        )}
      </section>

      {/* ── DATA ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <SectionHeader eyebrow="By the Numbers" title="Data" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <DataCard value="—" label="Add a real statistic in the admin" />
          <DataCard value="—" label="Add a real statistic in the admin" />
          <DataCard value="—" label="Add a real statistic in the admin" />
          <DataCard value="—" label="Add a real statistic in the admin" />
        </div>
      </section>

      {/* ── BIG TECH ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <div className="flex items-end justify-between mb-6">
          <SectionHeader eyebrow="Big Tech" title="Apple, Google, Microsoft & More" />
          <Link href="/bigtech" className="text-xs text-ink-faint hover:text-ink transition-colors whitespace-nowrap">View all →</Link>
        </div>
        {bigTech.length > 0 ? (
          <div className="grid sm:grid-cols-3 gap-6">
            {bigTech.slice(0, 3).map((a) => <ArticleCard key={a.slug} article={a} size="standard" />)}
          </div>
        ) : (
          <EmptySection label="Big Tech stories" />
        )}
      </section>

      {/* ── TRENDING ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 border-t border-border">
        <SectionHeader eyebrow="Most Read" title="Trending" />
        <div className="mt-6">
          <TrendingList articles={trending} />
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────── */}
      <NewsletterCard />
    </div>
  );
}
