import type { Metadata } from "next";
import Link from "next/link";
import { SNIPPETS, SNIPPET_CATEGORIES } from "@/lib/snippets";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@bidev/ui";

export const metadata: Metadata = pageMetadata({
  title: "Flutter & Dart Code Snippets – Copy-Ready",
  description: "Free Flutter and Dart code snippets you can copy into your project. Clean Architecture, BLoC, GetX, Riverpod, Dio, Firebase, GoRouter and more.",
  path: "/snippets",
});

const DIFFICULTY_COLORS = {
  beginner:     "text-green-400  bg-green-400/10  border-green-400/20",
  intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  advanced:     "text-red-400    bg-red-400/10    border-red-400/20",
};

export default function SnippetsPage() {
  const byCategory: Record<string, typeof SNIPPETS> = {};
  for (const cat of SNIPPET_CATEGORIES.slice(1)) {
    byCategory[cat] = SNIPPETS.filter((s) => s.category === cat);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-12">
        <span className="inline-block px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/8 text-cyan-400 text-xs font-medium mb-5">
          Flutter · Dart · Copy-Ready
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">
          Code <span className="text-gradient-accent">Snippets</span>
        </h1>
        <p className="text-ink-muted max-w-2xl">
          Production-tested Flutter and Dart patterns. Copy, adapt, and ship faster.
          Updated regularly with real-world solutions.
        </p>
        <div className="mt-4 flex items-center gap-4 text-sm text-ink-faint">
          <span>{SNIPPETS.length} snippets</span>
          <span>·</span>
          <span>{SNIPPET_CATEGORIES.length - 1} categories</span>
          <span>·</span>
          <span>Free forever</span>
        </div>
      </div>

      <AdSlot type="banner" className="mb-10" />

      {/* Category sections */}
      <div className="space-y-14">
        {SNIPPET_CATEGORIES.slice(1).map((cat) => {
          const items = byCategory[cat];
          if (!items.length) return null;
          return (
            <section key={cat}>
              <h2 className="text-xl font-bold text-ink mb-5 flex items-center gap-3">
                {cat}
                <span className="text-xs font-normal px-2 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
                  {items.length}
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((snippet) => (
                  <Link
                    key={snippet.slug}
                    href={`/snippets/${snippet.slug}`}
                    className="group flex flex-col gap-3 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
                        {snippet.title}
                      </h3>
                      <span className={`shrink-0 text-[10px] px-1.5 py-0.5 rounded border font-medium ${DIFFICULTY_COLORS[snippet.difficulty]}`}>
                        {snippet.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed">
                      {snippet.description}
                    </p>

                    {/* Code preview */}
                    <pre className="text-[11px] font-mono text-ink-faint bg-bg-elevated rounded-lg px-3 py-2 line-clamp-3 overflow-hidden leading-relaxed border border-border/50">
                      {snippet.code.split("\n").slice(0, 4).join("\n")}
                    </pre>

                    {/* Tags */}
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {snippet.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
                            {t}
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        View →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <AdSlot type="in-article" className="mt-12" />

      {/* CTA */}
      <div className="mt-14 p-8 rounded-2xl border border-border bg-bg-card text-center">
        <h2 className="text-xl font-bold text-ink mb-2">Want a snippet added?</h2>
        <p className="text-sm text-ink-muted mb-6">
          Missing a pattern? Suggest it and we&apos;ll add it to the library.
        </p>
        <Link
          href="/contact"
          className="inline-flex px-6 py-2.5 rounded-lg bg-bg-elevated border border-border text-sm text-ink hover:border-border-strong transition-colors"
        >
          Suggest a Snippet →
        </Link>
      </div>
    </div>
  );
}
