import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/articles";
import { formatDate, slugify } from "@/lib/utils";
import { TOOLS } from "@/lib/tools";
import { SNIPPETS } from "@/lib/snippets";
import { RESOURCES, RESOURCE_CATEGORIES } from "@/lib/resources";
import { ToolCard } from "@/components/tools/ToolCard";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { AdSlot } from "@bidev/ui";

export const revalidate = 60;

const CATEGORY_ICONS: Record<string, string> = {
  "Official Docs":     "📚",
  "Packages":          "📦",
  "State Management":  "⚡",
  "YouTube & Courses":  "🎥",
  "Communities":       "💬",
  "Tools":             "🛠️",
  "Books":             "📖",
};

export default async function HomePage() {
  const allArticles = await getAllArticles();
  const latest       = allArticles.slice(0, 8);
  const resourceCats = RESOURCE_CATEGORIES.slice(1);

  return (
    <div className="flex flex-col">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">
          Learn · Practice · Build · Ship
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-5 leading-tight">
          The Flutter <span className="text-gradient-accent">Developer Ecosystem</span>
        </h1>
        <p className="text-ink-muted max-w-2xl mx-auto mb-8 text-lg">
          Everything Flutter developers need in one place — tools, articles, snippets, and resources.
          No sign-up, no fluff, built by a developer who ships.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <Link
            href="/tools"
            className="px-6 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Explore Tools
          </Link>
          <Link
            href="/blog"
            className="px-6 py-3 rounded-lg border border-border text-ink text-sm hover:border-border-strong transition-colors"
          >
            Read Articles
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-faint">
          <span>{TOOLS.length}+ Tools</span>
          <span className="text-border-strong">·</span>
          <span>{SNIPPETS.length}+ Snippets</span>
          <span className="text-border-strong">·</span>
          <span>{RESOURCES.length}+ Resources</span>
          <span className="text-border-strong">·</span>
          <span>{allArticles.length}+ Articles</span>
        </div>
      </section>

      {/* ── FEATURED TOOLS ──────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-ink">Featured Developer Tools</h2>
          <Link href="/tools" className="text-xs text-ink-faint hover:text-ink transition-colors">
            View all tools →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      {/* ── RESOURCE HUB ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-ink">Flutter Resources Hub</h2>
          <Link href="/resources" className="text-xs text-ink-faint hover:text-ink transition-colors">
            View all resources →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourceCats.map((cat) => {
            const count = RESOURCES.filter((r) => r.category === cat).length;
            return (
              <Link
                key={cat}
                href={`/resources#${slugify(cat)}`}
                className="group flex flex-col gap-2 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat] ?? "📁"}</span>
                <h3 className="font-semibold text-ink group-hover:text-accent transition-colors text-sm">{cat}</h3>
                <p className="text-xs text-ink-faint">{count} resources</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── FEATURED ARTICLES ────────────────────────────────────── */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-ink">Featured Articles</h2>
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

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="in-article" />
      </div>

      {/* ── NEWSLETTER ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 w-full py-16 text-center">
        <h2 className="text-2xl font-bold text-ink mb-3">Stay in the loop</h2>
        <p className="text-ink-muted mb-6">
          Flutter tips, new tools, and articles — straight to your inbox. No spam.
        </p>
        <NewsletterForm />
      </section>

    </div>
  );
}
