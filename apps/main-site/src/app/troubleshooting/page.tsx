import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { breadcrumbJsonLd } from "@bidev/shared";
import { TROUBLESHOOTING_CATEGORIES, getAllTroubleshootingArticles, getFeaturedTroubleshooting } from "@/lib/troubleshooting";
import { TroubleshootingCard } from "@/components/blog/TroubleshootingCard";
import { AdSlot } from "@bidev/ui";

const { SITE_URL } = SITE_CONFIG;

export const revalidate = 60;

export const metadata: Metadata = pageMetadata({
  title: "Flutter Troubleshooting — Fix Real Flutter, Dart & Firebase Errors",
  description:
    "Practical, step-by-step solutions to real Flutter, Dart, Firebase, Android, and iOS problems. Find the fix, not another tutorial.",
  path: "/troubleshooting",
});

const EXAMPLE_SEARCHES = [
  "Flutter Gradle error",
  "Firebase Messaging not working",
  "CocoaPods error",
  "RenderFlex overflowed",
  "FIS_AUTH_ERROR",
];

export default async function TroubleshootingHub() {
  const [allArticles, featured] = await Promise.all([
    getAllTroubleshootingArticles(),
    getFeaturedTroubleshooting(6),
  ]);
  const latest = allArticles.slice(0, 6);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Troubleshooting", url: `${SITE_URL}/troubleshooting` },
  ]);

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">Troubleshooting</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-5 leading-tight">
          Flutter <span className="text-gradient-accent">Troubleshooting</span>
        </h1>
        <p className="text-ink-muted max-w-2xl mx-auto text-lg mb-8">
          Find solutions to common Flutter, Dart, Firebase, Android, and iOS problems.
        </p>

        <form action="/search" method="GET" className="max-w-xl mx-auto mb-4">
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-bg-card border border-border focus-within:border-accent transition-colors">
            <Search className="w-4 h-4 text-ink-faint shrink-0" />
            <input
              name="q"
              placeholder="Search Flutter errors and problems…"
              className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
              aria-label="Search Flutter errors and problems"
            />
          </div>
        </form>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {EXAMPLE_SEARCHES.map((q) => (
            <Link
              key={q}
              href={`/search?q=${encodeURIComponent(q)}`}
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-bg-card text-ink-muted hover:text-accent hover:border-accent/40 transition-colors"
            >
              {q}
            </Link>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <h2 className="text-lg font-semibold text-ink mb-8">Browse by Category</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TROUBLESHOOTING_CATEGORIES.map((cat) => {
            const count = allArticles.filter((a) => a.troubleshootingCategorySlug === cat.slug).length;
            return (
              <Link
                key={cat.slug}
                href={`/troubleshooting/${cat.slug}`}
                className="group flex flex-col gap-2 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
              >
                <cat.icon className="w-6 h-6 text-accent" strokeWidth={1.75} />
                <h3 className="font-semibold text-ink group-hover:text-accent transition-colors text-sm">{cat.name}</h3>
                <p className="text-xs text-ink-faint leading-relaxed">{cat.description}</p>
                <p className="text-xs text-ink-faint mt-1">
                  {count} solution{count === 1 ? "" : "s"}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── POPULAR PROBLEMS ─────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <h2 className="text-lg font-semibold text-ink mb-8">Popular Flutter Problems</h2>
        {featured.length === 0 ? (
          <p className="text-ink-faint">No troubleshooting guides yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map((a) => (
              <TroubleshootingCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="in-article" />
      </div>

      {/* ── LATEST SOLUTIONS ─────────────────────────────────────── */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <h2 className="text-lg font-semibold text-ink mb-8">Latest Troubleshooting Guides</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {latest.map((a) => (
              <TroubleshootingCard key={a.slug} article={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
