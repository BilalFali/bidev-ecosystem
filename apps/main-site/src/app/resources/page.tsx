import type { Metadata } from "next";
import { RESOURCES, RESOURCE_CATEGORIES } from "@/lib/resources";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@bidev/ui";

export const metadata: Metadata = pageMetadata({
  title: "Flutter & Dart Resources – Curated for Developers",
  description: "The best Flutter and Dart resources in one place. Official docs, packages, YouTube channels, books, tools, and communities — all curated for Flutter developers.",
  path: "/resources",
});

export default function ResourcesPage() {
  const byCategory: Record<string, typeof RESOURCES> = {};
  for (const cat of RESOURCE_CATEGORIES.slice(1)) {
    byCategory[cat] = RESOURCES.filter((r) => r.category === cat);
  }

  const freeCount = RESOURCES.filter((r) => r.free).length;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        <span className="inline-block px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/8 text-violet-400 text-xs font-medium mb-5">
          Curated · Always Updated
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">
          Flutter <span className="text-gradient-accent">Resources</span>
        </h1>
        <p className="text-ink-muted max-w-2xl">
          Every useful Flutter and Dart resource — packages, docs, courses, communities, and tools.
          Hand-picked by a developer who uses them daily.
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-ink-faint">
          <span>{RESOURCES.length} resources</span>
          <span>·</span>
          <span>{freeCount} free</span>
          <span>·</span>
          <span>{RESOURCE_CATEGORIES.length - 1} categories</span>
        </div>
      </div>

      <AdSlot type="banner" className="mb-10" />

      {/* Category sections */}
      <div className="space-y-12">
        {RESOURCE_CATEGORIES.slice(1).map((cat) => {
          const items = byCategory[cat];
          if (!items?.length) return null;
          return (
            <section key={cat}>
              <h2 className="text-xl font-bold text-ink mb-5 flex items-center gap-3">
                {CATEGORY_ICONS[cat] ?? "📁"} {cat}
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
                  {items.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((res) => (
                  <a
                    key={res.url}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col gap-3 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
                  >
                    {/* Badges */}
                    <div className="absolute top-4 right-4 flex gap-1.5">
                      {res.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent/15 text-accent border border-accent/25 font-medium">
                          {res.badge}
                        </span>
                      )}
                      {!res.free && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25 font-medium">
                          Paid
                        </span>
                      )}
                    </div>

                    <h3 className="font-semibold text-ink group-hover:text-accent transition-colors pr-16 leading-snug">
                      {res.title}
                    </h3>

                    <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {res.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        Visit →
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <AdSlot type="in-article" className="mt-12" />

      {/* Submit */}
      <div className="mt-14 p-8 rounded-2xl border border-dashed border-border bg-bg-card text-center">
        <h2 className="text-xl font-bold text-ink mb-2">Know a great resource?</h2>
        <p className="text-sm text-ink-muted mb-6">
          Found something worth sharing with the Flutter community? Suggest it below.
        </p>
        <a
          href="/contact"
          className="inline-flex px-6 py-2.5 rounded-lg bg-bg-elevated border border-border text-sm text-ink hover:border-border-strong transition-colors"
        >
          Suggest a Resource →
        </a>
      </div>
    </div>
  );
}

const CATEGORY_ICONS: Record<string, string> = {
  "Official Docs":       "📚",
  "Packages":            "📦",
  "State Management":    "⚡",
  "YouTube & Courses":   "🎥",
  "Communities":         "💬",
  "Tools":               "🛠️",
  "Books":               "📖",
};
