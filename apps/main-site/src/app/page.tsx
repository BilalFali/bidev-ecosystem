import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/articles";
import { formatDate } from "@/lib/utils";
import { AdSlot } from "@bidev/ui";

export const revalidate = 60;

export default async function HomePage() {
  const allArticles = await getAllArticles();
  const featured    = allArticles[0];
  const popular     = allArticles.slice(1, 5);
  const latest      = allArticles.slice(1, 9);

  return (
    <div className="flex flex-col">

      {/* ── HERO — Trending Now ─────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10">

        {/* Section label */}
        <div className="flex items-center gap-2 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-light opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-light" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-ink-faint">
            Trending Now
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr_300px] gap-6">

          {/* Featured article */}
          {featured ? (
            <Link
              href={`/blog/${featured.slug}`}
              className="group relative rounded-2xl border border-border bg-bg-card overflow-hidden hover:border-border-strong transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 sm:h-72 lg:h-80 bg-bg-elevated shrink-0 overflow-hidden">
                {featured.image ? (
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    priority
                    fetchPriority="high"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/15 via-bg-elevated to-bg-card" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />
                <div className="absolute top-4 left-4 flex gap-2">
                  {featured.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-md bg-bg-card/80 backdrop-blur-sm text-accent-light border border-accent/20 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 p-6">
                <h1 className="text-xl sm:text-2xl font-semibold text-ink group-hover:text-accent-light transition-colors leading-snug">
                  {featured.title}
                </h1>
                <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">
                  {featured.summary}
                </p>
                <div className="flex items-center gap-3 text-xs text-ink-faint mt-1">
                  <span className="font-medium text-ink-muted">{featured.author ?? "Bilal Fali"}</span>
                  <span>·</span>
                  <time dateTime={featured.publishedAt}>{formatDate(featured.publishedAt)}</time>
                  <span>·</span>
                  <span>{featured.readingTime} min read</span>
                </div>
              </div>
            </Link>
          ) : (
            <div className="rounded-2xl border border-border bg-bg-card h-64 flex items-center justify-center text-ink-faint text-sm">
              No articles yet
            </div>
          )}

          {/* Popular this week */}
          <div className="rounded-xl border border-border bg-bg-card p-5">
            <p className="text-xs font-semibold text-ink-faint uppercase tracking-widest mb-4">
              Popular This Week
            </p>
            <ol className="flex flex-col gap-4">
              {popular.map((post, i) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className="group flex items-start gap-3">
                    <span className="text-2xl font-bold text-border-strong leading-none shrink-0 w-6 text-right">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-muted group-hover:text-ink transition-colors leading-snug line-clamp-2">
                        {post.title}
                      </p>
                      <p className="text-xs text-ink-faint mt-1">{post.readingTime} min read</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Ad */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      {/* Latest Articles */}
      {latest.length > 1 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-ink">Latest Articles</h2>
            <Link href="/blog" className="text-xs text-ink-faint hover:text-ink transition-colors">
              View all →
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {latest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex gap-5 py-5 hover:bg-bg-card/40 -mx-3 px-3 rounded-xl transition-colors"
              >
                <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-lg overflow-hidden bg-bg-elevated shrink-0">
                  {post.image ? (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="128px"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-accent/10 to-bg-elevated" />
                  )}
                </div>

                <div className="flex flex-col justify-between min-w-0 flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      {post.tags[0] && (
                        <span className="text-[11px] font-mono text-accent-light">{post.tags[0]}</span>
                      )}
                      <span className="text-[11px] text-border-strong">·</span>
                      <time className="text-[11px] text-ink-faint" dateTime={post.publishedAt}>
                        {formatDate(post.publishedAt)}
                      </time>
                    </div>
                    <h3 className="text-sm font-semibold text-ink group-hover:text-accent-light transition-colors leading-snug line-clamp-2 mb-1">
                      {post.title}
                    </h3>
                    <p className="text-xs text-ink-faint leading-relaxed line-clamp-2 hidden sm:block">
                      {post.summary}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-[11px] text-ink-faint">
                    <span>{post.author ?? "Bilal Fali"}</span>
                    <span>·</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/blog"
              className="px-6 py-2.5 rounded-lg border border-border text-sm text-ink-muted hover:border-border-strong hover:text-ink transition-all"
            >
              Load more articles
            </Link>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pb-10">
        <AdSlot type="in-article" />
      </div>

    </div>
  );
}
