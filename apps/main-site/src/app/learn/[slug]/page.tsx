import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { pageMetadata, SITE_CONFIG } from "@/lib/seo";
import { breadcrumbJsonLd } from "@bidev/shared";
import { LEARN_CATEGORIES, getLearnCategoryBySlug } from "@/lib/learn";
import { getArticlesByCategorySlug } from "@/lib/articles";
import { TOOLS } from "@/lib/tools";
import { getAllInterviewQuestions } from "@/lib/interview-questions";
import { ArticleCard } from "@/components/blog/ArticleCard";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { AdSlot } from "@bidev/ui";

const { SITE_URL } = SITE_CONFIG;

export const revalidate = 60;

export function generateStaticParams() {
  return LEARN_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = getLearnCategoryBySlug(slug);
  if (!category) return pageMetadata({ title: "Learn", description: "Flutter guides by topic.", path: `/learn/${slug}` });

  return pageMetadata({
    title: `${category.name} — Flutter Guides`,
    description: category.intro,
    path: `/learn/${slug}`,
  });
}

export default async function LearnCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = getLearnCategoryBySlug(slug);
  if (!category) notFound();

  const [articles, allQuestions] = await Promise.all([
    getArticlesByCategorySlug(slug),
    getAllInterviewQuestions(),
  ]);
  const relatedTools = TOOLS.filter((t) => t.tags.some((tag) => category.toolTags.includes(tag))).slice(0, 6);
  const relatedQuestions = allQuestions.filter((q) => category.interviewCategories.includes(q.category)).slice(0, 6);

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    { name: "Learn", url: `${SITE_URL}/learn` },
    { name: category.name, url: `${SITE_URL}/learn/${slug}` },
  ]);

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-10">
        <nav className="text-xs text-ink-faint mb-5">
          <Link href="/learn" className="hover:text-ink-muted transition-colors">Learn</Link> / {category.name}
        </nav>
      </div>

      <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pb-10 text-center">
        <category.icon className="w-9 h-9 text-accent mx-auto mb-4" strokeWidth={1.75} />
        <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-4 leading-tight">{category.name}</h1>
        <p className="text-ink-muted leading-relaxed">{category.intro}</p>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <AdSlot type="banner" />
      </div>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
        <h2 className="text-lg font-semibold text-ink mb-8">
          {category.name} Guides {articles.length > 0 && `(${articles.length})`}
        </h2>
        {articles.length === 0 ? (
          <p className="text-ink-faint">More guides for this topic are on the way.</p>
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

      {relatedQuestions.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-10">
          <h2 className="text-lg font-semibold text-ink mb-8">Related Interview Questions</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedQuestions.map((q) => (
              <QuestionCard key={q.slug} question={q} />
            ))}
          </div>
        </section>
      )}

      <RelatedTools tools={relatedTools} maxWidth="max-w-7xl" />
    </div>
  );
}
