import Link from "next/link";
import { getAllBlogArticles } from "@/lib/articles";
import { slugify } from "@/lib/utils";
import { TOOLS, type Tool } from "@/lib/tools";
import { RESOURCES, RESOURCE_CATEGORIES, RESOURCE_CATEGORY_ICONS, RESOURCE_CATEGORY_FALLBACK_ICON } from "@/lib/resources";
import { LEARN_CATEGORIES } from "@/lib/learn";
import { getFeaturedTroubleshooting } from "@/lib/troubleshooting";
import { getAllInterviewQuestions, INTERVIEW_CATEGORIES, DIFFICULTIES } from "@/lib/interview-questions";
import { ToolCard } from "@/components/tools/ToolCard";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { TroubleshootingCard } from "@/components/blog/TroubleshootingCard";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { Button } from "@/components/ui/Button";
import { AdSlot } from "@bidev/ui";

export const revalidate = 60;

export default async function HomePage() {
  const [allArticles, interviewQuestions, problemGuides] = await Promise.all([
    getAllBlogArticles(),
    getAllInterviewQuestions(),
    getFeaturedTroubleshooting(4),
  ]);
  const latest       = allArticles.slice(0, 6);
  const resourceCats = RESOURCE_CATEGORIES.slice(1);
  const popularTools = TOOLS.filter((t) => t.popular);
  const otherTools   = TOOLS.filter((t) => !t.popular);

  return (
    <div className="flex flex-col">

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 overflow-hidden">
        <div aria-hidden="true" className="widget-tree-bg pointer-events-none absolute inset-x-0 top-0 h-80" />

        <div className="relative grid lg:grid-cols-[1fr_440px] gap-12 items-center">
          {/* Copy */}
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-ink mb-5 leading-[1.05] tracking-tight">
              Your Flutter developer hub
            </h1>
            <p className="text-ink-muted max-w-md mb-8 text-lg leading-relaxed">
              Learn Flutter and Dart, fix the errors that actually show up in
              production, and ship apps with code you can copy and trust.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/learn" prompt>Start learning</Button>
              <Button href="#solve-a-problem" variant="secondary">Fix an error</Button>
            </div>
          </div>

          {/* The hero device: a real terminal, not a gradient card */}
          <div className="terminal-window font-mono text-[12.5px] leading-relaxed">
            <div className="terminal-titlebar">
              <span className="terminal-dot" style={{ background: "#f87171" }} />
              <span className="terminal-dot" style={{ background: "#fbbf24" }} />
              <span className="terminal-dot" style={{ background: "#4ade80" }} />
              <span className="ml-2 text-ink-faint text-[11px]">main.dart</span>
            </div>
            <div className="p-5 flex flex-col gap-1.5">
              <p className="text-ink-faint">$ flutter run</p>
              <p className="text-ink-muted">Launching lib/main.dart on iPhone 15 Pro…</p>
              <p className="text-ink-muted">Running Gradle task &apos;assembleDebug&apos;…</p>
              <p className="text-signal">✓ Hot reload complete in 312ms</p>
              <p className="mt-3 text-ink-faint"># this site, in numbers</p>
              <p className="text-ink"><span className="text-accent-light">{TOOLS.length}+</span> free tools</p>
              <p className="text-ink"><span className="text-accent-light">{allArticles.length}+</span> tutorials &amp; guides</p>
              <p className="text-ink"><span className="text-accent-light">{RESOURCES.length}+</span> curated resources</p>
              <p className="text-ink-faint">$ <span className="caret-blink">▍</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LEARN FLUTTER ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <SectionHeading dot="bg-accent" title="Learn Flutter" href="/learn" linkLabel="See all topics" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEARN_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/learn/${cat.slug}`}
              className="group flex gap-4 p-5 rounded-lg border border-border bg-bg-card hover:border-accent/40 transition-colors"
            >
              <cat.icon className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="flex flex-col gap-1.5 min-w-0">
                <h3 className="font-semibold text-ink group-hover:text-accent transition-colors text-sm">{cat.name}</h3>
                <p className="text-xs text-ink-faint leading-relaxed line-clamp-2">{cat.intro}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── SOLVE A PROBLEM ──────────────────────────────────────── */}
      {problemGuides.length > 0 && (
        <section id="solve-a-problem" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10 scroll-mt-20">
          <SectionHeading
            dot="bg-red-400"
            title="Solve a Flutter problem"
            subtitle="Stuck on an error? Find a practical fix."
            href="/troubleshooting"
            linkLabel="See all troubleshooting"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {problemGuides.map((article) => (
              <TroubleshootingCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      {/* ── LATEST ARTICLES (card grid) ──────────────────────────── */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <SectionHeading dot="bg-accent" title="Latest articles" href="/blog" linkLabel="See all articles" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((article, i) => (
              <ArticleCard key={article.slug} article={article} priority={i < 3} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Button href="/blog" variant="secondary" size="md">Browse all articles</Button>
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      {/* ── FEATURED TOOLS (bento grid) ─────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <SectionHeading
          dot="bg-signal"
          title="Most-used tools"
          subtitle="Free, instant, runs in your browser."
          href="/tools"
          linkLabel={`All ${TOOLS.length} tools`}
        />

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
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" aria-hidden="true" />
                <h2 className="text-xl font-bold text-ink">Flutter interview questions &amp; answers</h2>
              </div>
              <p className="text-sm text-ink-muted mt-1">
                {interviewQuestions.length}+ questions across {INTERVIEW_CATEGORIES.length} categories, from {DIFFICULTIES[0]} to {DIFFICULTIES[DIFFICULTIES.length - 1]}.
              </p>
            </div>
            <Button href="/flutter-interview-questions" size="md" className="shrink-0">Start practicing</Button>
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
        <SectionHeading dot="bg-accent-light" title="Flutter resources hub" href="/resources" linkLabel="See all resources" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourceCats.map((cat) => {
            const count = RESOURCES.filter((r) => r.category === cat).length;
            return (
              <Link
                key={cat}
                href={`/resources#${slugify(cat)}`}
                className="group flex flex-col gap-2 p-5 rounded-lg border border-border bg-bg-card hover:border-accent/40 transition-colors"
              >
                {(() => {
                  const Icon = RESOURCE_CATEGORY_ICONS[cat] ?? RESOURCE_CATEGORY_FALLBACK_ICON;
                  return <Icon className="w-5 h-5 text-accent" strokeWidth={1.75} />;
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
          Flutter tips, new tools, and articles, straight to your inbox. No spam.
        </p>
        <NewsletterForm />
      </section>

    </div>
  );
}

/* ── Section heading: a color dot ties the heading to its card family
     below (blue = content, red = errors/troubleshooting, amber = tools)
     instead of a repeated all-caps eyebrow label. ─────────────────── */
function SectionHeading({
  dot,
  title,
  subtitle,
  href,
  linkLabel,
}: {
  dot: string;
  title: string;
  subtitle?: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-7">
      <div>
        <div className="flex items-center gap-2.5 mb-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dot}`} aria-hidden="true" />
          <h2 className="text-xl font-bold text-ink">{title}</h2>
        </div>
        {subtitle && <p className="text-sm text-ink-muted">{subtitle}</p>}
      </div>
      <Link href={href} className="text-xs text-ink-faint hover:text-ink transition-colors whitespace-nowrap mb-1">
        {linkLabel}
      </Link>
    </div>
  );
}

/* ── Bento wide card (col-span-2 on sm+) ───────────────────────────────── */
function BentoCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col gap-4 p-7 rounded-lg border border-accent/20 bg-bg-card hover:border-accent/50 transition-colors sm:col-span-2"
    >
      <span className="absolute top-5 right-5 text-[10px] font-mono px-2 py-1 rounded bg-signal-muted text-signal border border-signal/25">
        popular
      </span>
      <tool.icon className="w-9 h-9 text-accent" strokeWidth={1.75} />
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-ink text-base group-hover:text-accent transition-colors">
          {tool.title}
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed">{tool.description}</p>
      </div>
      <div className="flex gap-1.5">
        {tool.tags.map((t) => (
          <span key={t} className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
            {t}
          </span>
        ))}
      </div>
    </Link>
  );
}
