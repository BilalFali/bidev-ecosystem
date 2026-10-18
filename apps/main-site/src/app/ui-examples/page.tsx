import type { Metadata } from "next";
import Image from "next/image";
import { Star } from "lucide-react";
import { UI_EXAMPLES, UI_EXAMPLE_CATEGORIES } from "@/lib/ui-examples";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { collectionPageJsonLd } from "@bidev/shared";
import { AdSlot } from "@bidev/ui";

export const metadata: Metadata = pageMetadata({
  title: "Flutter UI Examples – Real Open-Source Apps & Widgets",
  description: "Real, open-source Flutter UI examples and widgets, hand-picked with links to the GitHub source. Full app UIs, reusable widgets, and template collections.",
  path: "/ui-examples",
});

export default function UiExamplesPage() {
  const byCategory: Record<string, typeof UI_EXAMPLES> = {};
  for (const cat of UI_EXAMPLE_CATEGORIES.slice(1)) {
    byCategory[cat] = UI_EXAMPLES.filter((e) => e.category === cat);
  }

  const collectionSchema = collectionPageJsonLd({
    name: "Flutter UI Examples",
    description: "Real, open-source Flutter UI examples and widgets with links to the GitHub source.",
    url: `${SITE_CONFIG.SITE_URL}/ui-examples`,
    items: UI_EXAMPLES.map((e) => ({ name: e.title, url: e.githubUrl })),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }} />

      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">
          Flutter UI examples
        </h1>
        <p className="text-ink-muted max-w-2xl">
          Real, open-source Flutter apps and widgets worth studying, each linked straight to its
          GitHub source so you can read the actual code, not just a screenshot.
        </p>
        <div className="mt-4 flex items-center divide-x divide-border text-sm text-ink-faint">
          <span className="pr-3">{UI_EXAMPLES.length} examples</span>
          <span className="pl-3">{UI_EXAMPLE_CATEGORIES.length - 1} categories</span>
        </div>
      </div>

      <AdSlot type="banner" className="mb-10" />

      <div className="space-y-14">
        {UI_EXAMPLE_CATEGORIES.slice(1).map((cat) => {
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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items.map((ex) => (
                  <a
                    key={ex.slug}
                    href={ex.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col rounded-xl border border-border bg-bg-card overflow-hidden hover:border-accent/40 transition-all duration-200"
                  >
                    <div className="relative w-full aspect-video bg-bg-elevated overflow-hidden">
                      <Image
                        src={ex.image}
                        alt={ex.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02]"
                        unoptimized
                      />
                    </div>

                    <div className="flex flex-col gap-2.5 p-5 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-ink group-hover:text-accent transition-colors leading-snug">
                          {ex.title}
                        </h3>
                        <span className="shrink-0 flex items-center gap-1 text-xs text-ink-faint">
                          <Star className="w-3 h-3" />
                          {ex.stars >= 1000 ? `${(ex.stars / 1000).toFixed(1)}k` : ex.stars}
                        </span>
                      </div>

                      <p className="text-xs text-ink-muted leading-relaxed line-clamp-3 flex-1">
                        {ex.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-1">
                        <div className="flex flex-wrap gap-1">
                          {ex.tags.slice(0, 2).map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
                              {t}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          View on GitHub
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <AdSlot type="in-article" className="mt-12" />

      <p className="mt-10 text-xs text-ink-faint text-center">
        All examples here are real open-source projects by their original authors, linked to their
        GitHub repositories. BiDev did not build or maintain these.
      </p>
    </div>
  );
}
