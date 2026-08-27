import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { breadcrumbJsonLd } from "@bidev/shared";
import {
  TROUBLESHOOTING_CATEGORIES,
  getTroubleshootingCategoryBySlug,
  getTroubleshootingArticlesByCategory,
} from "@/lib/troubleshooting";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { AdSlot } from "@bidev/ui";

const { SITE_URL } = SITE_CONFIG;

export const revalidate = 60;

export function generateStaticParams() {
  return TROUBLESHOOTING_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getTroubleshootingCategoryBySlug(slug);
  if (!category) {
    return pageMetadata({ title: "Troubleshooting", description: "Flutter troubleshooting guides.", path: `/troubleshooting/${slug}` });
  }

  return pageMetadata({
    title: `${category.name} Troubleshooting — Flutter, Dart & Firebase Fixes`,
    description: category.description,
    path: `/troubleshooting/${slug}`,
  });
}

export default async function TroubleshootingCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getTroubleshootingCategoryBySlug(slug);
  if (!category) notFound();

  const articles = await getTroubleshootingArticlesByCategory(slug);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Troubleshooting", url: `${SITE_URL}/troubleshooting` },
    { name: category.name, url: `${SITE_URL}/troubleshooting/${slug}` },
  ]);

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10">
        <nav className="text-xs text-ink-faint mb-5">
          <Link href="/troubleshooting" className="hover:text-ink-muted transition-colors">Troubleshooting</Link> / {category.name}
        </nav>
      </div>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-10 text-center">
        <category.icon className="w-9 h-9 text-accent mx-auto mb-4" strokeWidth={1.75} />
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4 leading-tight">{category.name} Troubleshooting</h1>
        <p className="text-ink-muted leading-relaxed">{category.description}</p>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <h2 className="text-lg font-semibold text-ink mb-8">
          {category.name} Solutions {articles.length > 0 && `(${articles.length})`}
        </h2>
        {articles.length === 0 ? (
          <p className="text-ink-faint">No troubleshooting guides yet for {category.name}.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a) => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="in-article" />
      </div>
    </div>
  );
}
