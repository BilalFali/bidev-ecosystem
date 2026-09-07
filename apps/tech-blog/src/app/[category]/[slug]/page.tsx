import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articleJsonLd, breadcrumbJsonLd } from "@bidev/shared";
import { articleMetadata, SITE_CONFIG } from "@/lib/seo";
import { getArticleBySlug, getAllArticleSlugs, getAllArticles } from "@/lib/articles";
import { ArticleHero } from "@/components/article/ArticleHero";
import { RelatedStories } from "@/components/article/RelatedStories";
import { ShareButtons } from "@/components/article/ShareButtons";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Tag } from "@/components/ui/Tag";
import { NewsletterCard } from "@/components/ui/NewsletterCard";

const { SITE_URL, SITE_NAME } = SITE_CONFIG;

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  const all = await getAllArticles();
  return slugs.map((slug) => {
    const article = all.find((a) => a.slug === slug);
    return { category: article?.categorySlug ?? "article", slug };
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return {};
  return articleMetadata(article);
}

export default async function ArticlePage({ params }: { params: Promise<{ category: string; slug: string }> }) {
  const { category, slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const articleUrl = `${SITE_URL}/${category}/${slug}`;
  const allArticles = await getAllArticles();
  const related = allArticles
    .filter((a) => a.slug !== article.slug && a.categorySlug === article.categorySlug)
    .slice(0, 3);

  const wordCount = article.content ? article.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length : undefined;

  const schema = articleJsonLd({
    url: articleUrl,
    siteUrl: SITE_URL,
    title: article.title,
    description: article.dek || article.excerpt,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    authorName: article.author,
    siteName: SITE_NAME,
    image: article.coverUrl,
    wordCount,
  });

  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE_URL },
    ...(article.category ? [{ name: article.category, url: `${SITE_URL}/${category}` }] : []),
    { name: article.title, url: articleUrl },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              ...(article.category ? [{ name: article.category, href: `/${category}` }] : []),
              { name: article.title },
            ]}
          />
        </div>

        <ArticleHero article={article} />

        {article.content && (
          <div
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        )}

        {article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
            {article.tags.map((t) => <Tag key={t} label={t} />)}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <span className="text-sm text-ink-muted">Share this story</span>
          <ShareButtons url={articleUrl} title={article.title} />
        </div>

        <RelatedStories articles={related} />
      </article>

      <NewsletterCard />
    </>
  );
}
