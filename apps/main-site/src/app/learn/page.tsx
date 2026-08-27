import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { breadcrumbJsonLd } from "@bidev/shared";
import { LEARN_CATEGORIES } from "@/lib/learn";
import { AdSlot } from "@bidev/ui";

const { SITE_URL } = SITE_CONFIG;

export const metadata: Metadata = pageMetadata({
  title: "Learn Flutter — Guides by Topic",
  description:
    "Flutter, Dart, Firebase, state management, architecture, and networking guides organized by topic. Learn the parts you actually need.",
  path: "/learn",
});

export default function LearnHub() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Learn", url: `${SITE_URL}/learn` },
  ]);

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">Learn</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-5 leading-tight">
          Learn <span className="text-gradient-accent">Flutter</span> by Topic
        </h1>
        <p className="text-ink-muted max-w-2xl mx-auto text-lg">
          Guides organized around what you're actually trying to build — not a wall of blog posts.
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {LEARN_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/learn/${cat.slug}`}
              className="group flex flex-col gap-3 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
            >
              <cat.icon className="w-7 h-7 text-accent" strokeWidth={1.75} />
              <h2 className="font-semibold text-ink group-hover:text-accent transition-colors">{cat.name}</h2>
              <p className="text-sm text-ink-muted leading-relaxed line-clamp-3">{cat.intro}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
