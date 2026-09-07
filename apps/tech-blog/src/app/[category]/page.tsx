import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionHeader } from "@bidev/ui";
import { pageMetadata } from "@/lib/seo";
import { getCategoryBySlug, getAllCategories } from "@/lib/categories";
import { getArticlesByCategorySlug } from "@/lib/articles";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const revalidate = 300;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return pageMetadata({ title: "Not Found", description: "", path: `/${slug}` });

  return pageMetadata({
    title: category.name,
    description: category.description ?? `${category.name} news and analysis from BiDev Tech.`,
    path: `/${slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const articles = await getArticlesByCategorySlug(slug);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <Breadcrumbs items={[{ name: "Home", href: "/" }, { name: category.name }]} />
      <div className="mt-4 mb-10">
        <SectionHeader eyebrow={`${articles.length} ${articles.length === 1 ? "story" : "stories"}`} title={category.name} description={category.description ?? undefined} />
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-ink-faint py-10">No stories in {category.name} yet — check back soon.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((a) => (
            <ArticleCard key={a.slug} article={a} size="standard" />
          ))}
        </div>
      )}
    </div>
  );
}
