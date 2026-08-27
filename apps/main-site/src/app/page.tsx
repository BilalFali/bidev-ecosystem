import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import { slugify } from "@/lib/utils";
import { TOOLS, type Tool } from "@/lib/tools";
import { SNIPPETS } from "@/lib/snippets";
import { RESOURCES, RESOURCE_CATEGORIES, RESOURCE_CATEGORY_ICONS, RESOURCE_CATEGORY_FALLBACK_ICON } from "@/lib/resources";
import { LEARN_CATEGORIES } from "@/lib/learn";
import { getAllInterviewQuestions, INTERVIEW_CATEGORIES, DIFFICULTIES } from "@/lib/interview-questions";
import { ToolCard } from "@/components/tools/ToolCard";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { AdSlot } from "@bidev/ui";

// Categories that read as "practical, fix-a-real-problem" guides today —
// stands in for a dedicated Troubleshooting category until enough of that
// content exists to justify its own /learn page.
const PROBLEM_SOLVING_CATEGORY_SLUGS = ["architecture", "data-storage", "api-networking"];

export const revalidate = 60;

export default async function HomePage() {
  const [allArticles, interviewQuestions] = await Promise.all([getAllArticles(), getAllInterviewQuestions()]);
  const latest       = allArticles.slice(0, 6);
  const resourceCats = RESOURCE_CATEGORIES.slice(1);
  const popularTools = TOOLS.filter((t) => t.popular);
  const otherTools   = TOOLS.filter((t) => !t.popular);
  const problemGuides = allArticles
    .filter((a) => a.categorySlug && PROBLEM_SOLVING_CATEGORY_SLUGS.includes(a.categorySlug))
    .slice(0, 4);

  return (
    <div className="flex flex-col">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-full"
          style={{ background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(1,117,194,0.13) 0%, transparent 70%)" }}
        />

        <p className="relative animate-fade-in text-xs font-semibold uppercase tracking-widest text-accent mb-5">
          Flutter · Dart · Firebase
        </p>
        <h1 className="relative animate-slide-up text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-5 leading-tight">
          Your Flutter{" "}
          <span className="text-gradient-accent">Developer Hub</span>
        </h1>
        <p className="relative animate-slide-up text-ink-muted max-w-xl mx-auto mb-8 text-lg leading-relaxed"
          style={{ animationDelay: "60ms" }}>
          Learn Flutter. Fix real problems. Build production-ready apps.
        </p>

        <div className="relative animate-slide-up flex flex-wrap items-center justify-center gap-3 mb-12"
          style={{ animationDelay: "120ms" }}>
          <Link
            href="/learn"
            className="px-6 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors"
          >
            Explore Flutter
          </Link>
          <Link
            href="#solve-a-problem"
            className="px-6 py-3 rounded-lg border border-border text-ink text-sm hover:border-border-strong transition-colors"
          >
            Solve a Problem
          </Link>
        </div>

        <div className="relative animate-fade-in flex flex-wrap items-center justify-center gap-3"
          style={{ animationDelay: "180ms" }}>
          {[
            { value: `${TOOLS.length}+`,       label: "Free Tools" },
            { value: `${SNIPPETS.length}+`,    label: "Snippets" },
            { value: `${RESOURCES.length}+`,   label: "Resources" },
            { value: `${allArticles.length}+`, label: "Articles" },
          ].map(({ value, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-bg-card text-sm"
            >
              <span className="font-bold text-ink">{value}</span>
              <span className="text-ink-faint">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── LEARN FLUTTER ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="flex items-end justify-between mb-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1.5">Learn</p>
            <h2 className="text-xl font-bold text-ink">Learn Flutter</h2>
          </div>
          <Link href="/learn" className="text-xs text-ink-faint hover:text-ink transition-colors mb-1">
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEARN_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/learn/${cat.slug}`}
              className="group flex flex-col gap-2 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
            >
              <cat.icon className="w-6 h-6 text-accent" strokeWidth={1.75} />
              <h3 className="font-semibold text-ink group-hover:text-accent transition-colors text-sm">{cat.name}</h3>
              <p className="text-xs text-ink-faint line-clamp-2">{cat.intro}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SOLVE A PROBLEM ──────────────────────────────────────── */}
      {problemGuides.length > 0 && (
        <section id="solve-a-problem" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10 scroll-mt-20">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1.5">Practical Guides</p>
              <h2 className="text-xl font-bold text-ink">Solve a Flutter Problem</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {problemGuides.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* ── LATEST ARTICLES (card grid) ──────────────────────────── */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1.5">Tutorials & Guides</p>
              <h2 className="text-xl font-bold text-ink">Latest Articles</h2>
            </div>
            <Link href="/blog" className="text-xs text-ink-faint hover:text-ink transition-colors mb-1">
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((article, i) => (
              <ArticleCard key={article.slug} article={article} priority={i < 3} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link
              href="/blog"
              className="px-6 py-2.5 rounded-lg border border-border text-sm text-ink-muted hover:border-border-strong hover:text-ink transition-all"
            >
              Browse all articles
            </Link>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      {/* ── FEATURED TOOLS (bento grid) ─────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1.5">Developer Tools</p>
            <h2 className="text-xl font-bold text-ink">Most-Used Tools</h2>
            <p className="text-sm text-ink-muted mt-1">Free, instant, runs in your browser.</p>
          </div>
          <Link href="/tools" className="text-xs text-ink-faint hover:text-ink transition-colors whitespace-nowrap mb-1">
            All {TOOLS.length} tools →
          </Link>
        </div>

        {/*
          Bento layout (sm: 3 cols):
          Row 1 → [popularTools[0]: col-span-2] [popularTools[1]: col-span-1]
          Row 2 → [popularTools[2]: col-span-1] [popularTools[3]: col-span-2]
        */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-7 mb-5">
          {popularTools[0] && <BentoCard tool={popularTools[0]} />}
          {popularTools[1] && <ToolCard tool={popularTools[1]} />}
          {popularTools[2] && <ToolCard tool={popularTools[2]} />}
          {popularTools[3] && <BentoCard tool={popularTools[3]} />}
        </div>

        {/* Secondary tools — uniform grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* ── INTERVIEW PREP ───────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="p-8 rounded-2xl border border-border bg-bg-card">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-1.5">Interview Prep</p>
              <h2 className="text-xl font-bold text-ink">Flutter Interview Questions &amp; Answers</h2>
              <p className="text-sm text-ink-muted mt-1">
                {interviewQuestions.length}+ questions across {INTERVIEW_CATEGORIES.length} categories, from {DIFFICULTIES[0]} to {DIFFICULTIES[DIFFICULTIES.length - 1]}.
              </p>
            </div>
            <Link
              href="/flutter-interview-questions"
              className="shrink-0 px-5 py-2.5 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors"
            >
              Start Practicing →
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            {DIFFICULTIES.map((d) => (
              <Link
                key={d}
                href={`/flutter-interview-questions/${d.toLowerCase()}`}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-bg-elevated text-ink-muted hover:text-accent hover:border-accent/40 transition-colors"
              >
                {d}
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                {(() => {
                  const Icon = RESOURCE_CATEGORY_ICONS[cat] ?? RESOURCE_CATEGORY_FALLBACK_ICON;
                  return <Icon className="w-6 h-6 text-accent" strokeWidth={1.75} />;
                })()}
                <h3 className="font-semibold text-ink group-hover:text-accent transition-colors text-sm">{cat}</h3>
                <p className="text-xs text-ink-faint">{count} resources</p>
              </Link>
            );
          })}
        </div>
      </section>

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

/* ── Bento wide card (col-span-2 on sm+) ───────────────────────────────── */
function BentoCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col gap-4 p-7 rounded-xl border border-accent/20 bg-bg-card hover:border-accent/50 hover:bg-bg-elevated transition-all duration-200 sm:col-span-2"
    >
      <span className="absolute top-5 right-5 text-xs px-2.5 py-1 rounded-full bg-accent/15 text-accent border border-accent/25">
        Popular
      </span>
      <tool.icon className="w-9 h-9 text-accent" strokeWidth={1.75} />
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-ink text-base group-hover:text-accent transition-colors">
          {tool.title}
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed">{tool.description}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-1.5">
          {tool.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
              {t}
            </span>
          ))}
        </div>
        <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          Open →
        </span>
      </div>
    </Link>
  );
}
