import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { breadcrumbJsonLd } from "@bidev/shared";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { slugify } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Flutter & Mobile Dev Tutorials by Topic | BiDev",
  description:
    "Browse every Flutter, Firebase, Dart, and mobile development tutorial on bidev.dev, organized by topic. Find exactly what you need to level up your skills.",
  path: "/topics",
});

const RECENT_COUNT   = 9;   // how many cards in the "Recently Published" section
const PER_CATEGORY   = 6;   // max cards shown per category section

export default async function TopicsPage() {
  const { SITE_URL } = SITE_CONFIG;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home",   url: SITE_URL },
    { name: "Topics", url: `${SITE_URL}/topics` },
  ]);

  // All published articles, newest first
  const articles = await getAllArticles();

  // Aggregate tags with counts (from merged MDX + DB sources)
  const tagCounts: Record<string, number> = {};
  for (const a of articles) {
    for (const t of a.tags) {
      tagCounts[t] = (tagCounts[t] ?? 0) + 1;
    }
  }
  // Sort by count desc, then alpha — most-used tags first
  const tags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag, count]) => ({ tag, count }));

  const recentArticles = articles.slice(0, RECENT_COUNT);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
          All Topics
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">
          Tutorials by <span className="text-accent">Topic</span>
        </h1>
        <p className="text-ink-muted max-w-xl text-lg">
          Every tutorial on bidev.dev, organized by topic. Click a tag to jump straight to that section.
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-ink-faint">
          <span>{articles.length} article{articles.length !== 1 ? "s" : ""}</span>
          <span>·</span>
          <span>{tags.length} topic{tags.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* ── Category pill nav ───────────────────────────────────────────── */}
      <div className="sticky top-[57px] z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-3 bg-bg/90 backdrop-blur border-b border-border mb-12">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-0.5">
          <a
            href="#recent"
            className="inline-flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-bg-card text-ink-muted hover:border-accent/50 hover:text-accent transition-colors"
          >
            <Sparkles className="w-3 h-3" strokeWidth={1.75} />
            Recent
          </a>
          {tags.map(({ tag, count }) => (
            <a
              key={tag}
              href={`#${slugify(tag)}`}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-bg-card text-ink-muted hover:border-accent/50 hover:text-accent transition-colors"
            >
              {tag}
              <span className="ml-1 opacity-50">({count})</span>
            </a>
          ))}
        </div>
      </div>

      {/* ── Recently Published ──────────────────────────────────────────── */}
      <section id="recent" className="scroll-mt-28 mb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-ink">
            Recently Published
          </h2>
          <Link
            href="/blog"
            className="text-xs text-ink-faint hover:text-accent transition-colors"
          >
            View all articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {recentArticles.map((article, i) => (
            <ArticleCard key={article.slug} article={article} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* ── Per-category sections ───────────────────────────────────────── */}
      <div className="space-y-20">
        {tags.map(({ tag }) => {
          const categoryArticles = articles.filter((a) =>
            a.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
          );
          const shown   = categoryArticles.slice(0, PER_CATEGORY);
          const hasMore = categoryArticles.length > PER_CATEGORY;

          return (
            <section key={tag} id={slugify(tag)} className="scroll-mt-28">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-ink">{tag}</h2>
                  <span className="text-xs px-2 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
                    {categoryArticles.length}
                  </span>
                </div>
                {hasMore && (
                  <Link
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-xs text-ink-faint hover:text-accent transition-colors"
                  >
                    View all {tag} articles →
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {shown.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>

              {hasMore && (
                <div className="mt-6 text-center">
                  <Link
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-bg-card text-sm text-ink-muted hover:border-accent/40 hover:text-accent transition-colors"
                  >
                    View all {categoryArticles.length} {tag} articles →
                  </Link>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
