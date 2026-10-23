import Link from "next/link";
import { Check } from "lucide-react";
import { getAllBlogArticles } from "@/lib/articles";
import { slugify } from "@/lib/utils";
import { TOOLS, type Tool } from "@/lib/tools";
import { RESOURCES, RESOURCE_CATEGORIES, RESOURCE_CATEGORY_ICONS, RESOURCE_CATEGORY_FALLBACK_ICON } from "@/lib/resources";
import { LEARN_CATEGORIES } from "@/lib/learn";
import { getFeaturedTroubleshooting } from "@/lib/troubleshooting";
import { getAllInterviewQuestions, INTERVIEW_CATEGORIES, DIFFICULTIES } from "@/lib/interview-questions";
import { getAllProducts, formatPrice } from "@/lib/products";
import { PACKAGES } from "@/lib/packages";
import { topTags } from "@/lib/topics";
import { Package as PackageIcon, ExternalLink } from "lucide-react";
import { ToolCard } from "@/components/tools/ToolCard";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { TroubleshootingCard } from "@/components/blog/TroubleshootingCard";
import { NewsletterForm } from "@/components/ui/NewsletterForm";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/home/SectionHeading";
import { JsonToDartPreview } from "@/components/home/JsonToDartPreview";
import { TrustStrip } from "@/components/home/TrustStrip";
import { AdSlot } from "@bidev/ui";

export const revalidate = 60;

export default async function HomePage() {
  const [allArticles, interviewQuestions, problemGuides, products] = await Promise.all([
    getAllBlogArticles(),
    getAllInterviewQuestions(),
    getFeaturedTroubleshooting(4),
    getAllProducts(),
  ]);
  const latest       = allArticles.slice(0, 6);
  const topics       = topTags(allArticles, 8);
  const resourceCats = RESOURCE_CATEGORIES.slice(1);
  const popularTools = TOOLS.filter((t) => t.popular);
  const otherTools   = TOOLS.filter((t) => !t.popular);

  return (
    <div className="flex flex-col">

      {/* HERO */}
      <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-14 pb-16 overflow-hidden">
        <div aria-hidden="true" className="widget-tree-bg pointer-events-none absolute inset-x-0 top-0 h-80" />
        <div className="relative grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 animate-fade-in">
            <p className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-bg-card border border-border font-mono text-[11px] text-teal">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-teal motion-safe:animate-pulse" />
              Built for Flutter developers
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-5 leading-[1.08] tracking-tight">
              Flutter knowledge from{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-light to-teal">
                real production apps
              </span>
            </h1>
            <p className="text-ink-muted max-w-md mb-8 text-lg leading-relaxed">
              Tutorials, free tools, and snippets built by a developer who ships apps to Google Play.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/tools" prompt>Browse tools</Button>
              <Button href="/blog" variant="secondary">Read articles</Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <JsonToDartPreview />
          </div>
        </div>
      </section>

      <TrustStrip />

      {/* LEARN FLUTTER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <SectionHeading eyebrow="learn" title="Learn Flutter" href="/learn" linkLabel="See all topics" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEARN_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/learn/${cat.slug}`}
              className="group flex gap-4 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 transition-colors"
            >
              <cat.icon className="w-5 h-5 text-accent shrink-0 mt-0.5" strokeWidth={1.75} />
              <div className="flex flex-col gap-1.5 min-w-0">
                <h3 className="font-semibold text-ink group-hover:text-accent-light transition-colors text-sm">{cat.name}</h3>
                <p className="text-xs text-ink-faint leading-relaxed line-clamp-2">{cat.intro}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SOLVE A PROBLEM */}
      {problemGuides.length > 0 && (
        <section id="solve-a-problem" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10 scroll-mt-20">
          <SectionHeading
            eyebrow="fix errors"
            tone="danger"
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

      {/* LATEST ARTICLES */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <SectionHeading
            eyebrow="guides"
            title="Latest articles"
            href="/blog"
            linkLabel={`All ${allArticles.length} articles`}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((article, i) => (
              <ArticleCard key={article.slug} article={article} priority={i < 3} />
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      {/* FEATURED TOOLS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <SectionHeading
          eyebrow="free utilities"
          tone="teal"
          title="Most-used tools"
          subtitle="Free, instant, runs in your browser."
          href="/tools"
          linkLabel={`All ${TOOLS.length} tools`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-7 mb-5">
          {popularTools[0] && <BentoCard tool={popularTools[0]} />}
          {popularTools[1] && <ToolCard tool={popularTools[1]} />}
          {popularTools[2] && <ToolCard tool={popularTools[2]} />}
          {popularTools[3] && <BentoCard tool={popularTools[3]} />}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {otherTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* PACKAGES */}
      {PACKAGES.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <SectionHeading
            eyebrow="open source"
            tone="teal"
            title="Flutter packages"
            subtitle="Published on pub.dev, free to use in any project."
            href="/packages"
            linkLabel={`All ${PACKAGES.length} package${PACKAGES.length !== 1 ? "s" : ""}`}
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PACKAGES.map((pkg) => (
              <div
                key={pkg.name}
                className="relative flex flex-col gap-4 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/40 transition-colors"
              >
                {pkg.featured && (
                  <span className="absolute top-4 right-4 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                    Featured
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <pkg.icon className="w-6 h-6 text-accent shrink-0" strokeWidth={1.75} />
                  <h3 className="font-semibold text-ink font-mono text-sm">{pkg.name}</h3>
                </div>
                <p className="text-sm text-ink-muted leading-relaxed flex-1">{pkg.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pkg.tags.map((t) => (
                    <span key={t} className="text-[11px] px-2 py-0.5 rounded border border-border bg-bg-elevated text-ink-faint">
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={`https://pub.dev/packages/${pkg.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center gap-1.5 text-sm text-accent-light hover:underline"
                >
                  <PackageIcon className="w-3.5 h-3.5" />
                  View on pub.dev
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INTERVIEW PREP */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="p-8 rounded-2xl border border-accent/30 bg-bg-card">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="font-mono text-xs mb-1.5 text-accent-light">// interview prep</p>
              <h2 className="text-xl sm:text-2xl font-bold text-ink">Flutter interview questions &amp; answers</h2>
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
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-bg-elevated text-ink-muted hover:text-accent-light hover:border-accent/40 transition-colors"
              >
                {d}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BROWSE BY TOPIC */}
      {topics.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <SectionHeading eyebrow="browse by topic" title="Find articles by topic" href="/topics" linkLabel="All topics" />
          <div className="flex flex-wrap gap-3">
            {topics.map(({ tag, count }) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-border bg-bg-card text-sm text-ink hover:border-accent/40 hover:bg-bg-elevated transition-colors"
              >
                <span>{tag}</span>
                <span className="font-mono text-xs text-ink-faint">{count}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* RESOURCE HUB */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <SectionHeading eyebrow="resources" title="Flutter resources hub" href="/resources" linkLabel="See all resources" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resourceCats.map((cat) => {
            const count = RESOURCES.filter((r) => r.category === cat).length;
            const Icon = RESOURCE_CATEGORY_ICONS[cat] ?? RESOURCE_CATEGORY_FALLBACK_ICON;
            return (
              <Link
                key={cat}
                href={`/resources#${slugify(cat)}`}
                className="group flex flex-col gap-2 p-5 rounded-xl border border-border bg-bg-card hover:border-accent/40 transition-colors"
              >
                <Icon className="w-5 h-5 text-accent" strokeWidth={1.75} />
                <h3 className="font-semibold text-ink group-hover:text-accent-light transition-colors text-sm">{cat}</h3>
                <p className="text-xs text-ink-faint">{count} resources</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* PRODUCTS */}
      {products.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <SectionHeading
            eyebrow="starter kits"
            tone="tertiary"
            title="Production templates"
            subtitle="Skip the boilerplate and start from working code."
            href="/products"
            linkLabel="All products"
          />
          <div className={products.length > 1 ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "max-w-xl"}>
            {products.slice(0, 2).map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.slug}`}
                className="group flex flex-col gap-4 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/40 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-semibold px-2.5 py-1 rounded bg-accent/10 text-accent-light border border-accent/20">
                    {formatPrice(p.price)}
                  </span>
                  {p.badge && (
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-teal-muted text-teal border border-teal/25">
                      {p.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink group-hover:text-accent-light transition-colors">{p.title}</h3>
                  <p className="text-sm text-ink-muted mt-2 leading-relaxed">{p.short_description}</p>
                </div>
                {p.features.length > 0 && (
                  <ul className="flex flex-col gap-2 text-sm text-ink-muted">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-teal shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <span className="mt-auto pt-4 border-t border-border text-sm text-accent-light">View product</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="in-article" />
      </div>

      {/* NEWSLETTER */}
      <section id="newsletter" className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 w-full py-16 scroll-mt-20">
        <div className="rounded-xl border border-border bg-bg-card p-8 text-center">
          <h2 className="text-2xl font-bold text-ink mb-3">Stay in the loop</h2>
          <p className="text-ink-muted mb-6">
            Flutter tips, new tools, and articles, straight to your inbox. No spam.
          </p>
          <NewsletterForm />
        </div>
      </section>

    </div>
  );
}

/* Bento wide card (col-span-2 on sm+) */
function BentoCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group relative flex flex-col gap-4 p-7 rounded-xl border border-accent/20 bg-bg-card hover:border-accent/50 transition-colors sm:col-span-2"
    >
      <span className="absolute top-5 right-5 text-[10px] font-mono px-2 py-1 rounded bg-signal-muted text-signal border border-signal/25">
        popular
      </span>
      <tool.icon className="w-9 h-9 text-accent" strokeWidth={1.75} />
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-ink text-base group-hover:text-accent-light transition-colors">
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
