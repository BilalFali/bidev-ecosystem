import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllBlogArticles } from "@/lib/articles";
import { getAllTags } from "@/lib/mdx";
import { formatDate } from "@/lib/utils";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@bidev/ui";
import { Sparkles } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Blog – Flutter, Mobile Dev & Developer Tools",
  description: "In-depth Flutter tutorials, Firebase guides, mobile development articles, and AI tools for developers.",
  path: "/blog",
});

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string; q?: string }>;
}) {
  const { tag, q } = await searchParams;
  const allArticles = await getAllBlogArticles();
  const allTags     = getAllTags();

  const activeTag = tag ?? "";
  const query     = q?.toLowerCase() ?? "";

  const posts = allArticles.filter((p) => {
    const matchTag = !activeTag || p.tags.some((t) => t.toLowerCase() === activeTag.toLowerCase());
    const matchQ   = !query    || p.title.toLowerCase().includes(query) || p.summary.toLowerCase().includes(query);
    return matchTag && matchQ;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">All Articles</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">Developer Blog</h1>
        <p className="text-ink-muted max-w-xl">
          Flutter tutorials, Firebase guides, mobile dev patterns, and AI tools — written for developers who ship.
        </p>
      </div>

      {/* Search */}
      <form className="mb-8" method="GET">
        <div className="flex gap-3 max-w-lg">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search articles..."
            className="flex-1 px-4 py-2.5 rounded-lg bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent text-sm transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-bg-elevated border border-border text-sm text-ink hover:border-border-strong transition-colors"
          >
            Search
          </button>
        </div>
      </form>

      {/* Top Ad */}
      <AdSlot type="banner" className="mb-10" />

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Posts */}
        <div className="flex-1 min-w-0">
          {/* Tag filter pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/blog"
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                !activeTag ? "bg-accent text-bg border-accent" : "bg-bg-card border-border text-ink-muted hover:border-border-strong"
              }`}
            >
              All
            </Link>
            {allTags.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  activeTag.toLowerCase() === tag.toLowerCase()
                    ? "bg-accent text-bg border-accent"
                    : "bg-bg-card border-border text-ink-muted hover:border-border-strong"
                }`}
              >
                {tag} <span className="opacity-60">({count})</span>
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20 text-ink-muted">No articles found. Try a different search.</div>
          ) : (
            <div className="grid gap-5">
              {posts.map((post, i) => (
                <div key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col sm:flex-row gap-5 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/30 hover:bg-bg-elevated transition-all"
                  >
                    <div className="flex flex-col gap-3 flex-1 min-w-0">
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                            {t}
                          </span>
                        ))}
                      </div>
                      <h2 className="text-lg font-bold text-ink group-hover:text-accent transition-colors leading-snug">
                        {post.title}
                      </h2>
                      <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">{post.summary}</p>
                      <div className="flex items-center gap-3 text-xs text-ink-faint mt-1">
                        <span>{post.author}</span>
                        <span>·</span>
                        <span>{formatDate(post.publishedAt)}</span>
                        <span>·</span>
                        <span>{post.readingTime} min read</span>
                      </div>
                    </div>

                    {/* Cover thumbnail — priority on first 3 for LCP */}
                    <div className="sm:w-32 sm:h-24 rounded-lg overflow-hidden bg-bg-elevated border border-border flex-shrink-0 flex items-center justify-center">
                      {post.image ? (
                        <Image
                          src={post.image}
                          alt={post.title}
                          width={128}
                          height={96}
                          sizes="(max-width: 640px) 100vw, 128px"
                          className="w-full h-full object-cover"
                          priority={i < 3}
                          loading={i < 3 ? "eager" : "lazy"}
                        />
                      ) : (
                        <Sparkles className="w-6 h-6 opacity-20" strokeWidth={1.5} />
                      )}
                    </div>
                  </Link>
                  {/* In-article ad every 4 posts */}
                  {(i + 1) % 4 === 0 && <AdSlot type="in-article" className="mt-5" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-72 flex-shrink-0 flex flex-col gap-6">
          <div className="sticky top-24">
            <AdSlot type="sidebar" />
            <div className="mt-6 p-5 rounded-xl border border-border bg-bg-card">
              <h3 className="text-sm font-semibold text-ink mb-4">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 10).map(({ tag }) => (
                  <Link
                    key={tag}
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="text-xs px-2.5 py-1 rounded-full bg-bg-elevated border border-border text-ink-muted hover:border-accent/50 hover:text-accent transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
            <div className="mt-6 p-5 rounded-xl border border-accent/20 bg-accent/5">
              <h3 className="text-sm font-semibold text-ink mb-2">Newsletter</h3>
              <p className="text-xs text-ink-muted mb-4">Weekly Flutter & dev tips.</p>
              <Link href="/#newsletter" className="block w-full text-center px-4 py-2 rounded-lg bg-accent text-bg text-xs font-semibold hover:bg-accent-hover transition-colors">
                Subscribe →
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
