import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import Link from "next/link";
import { getAllArticleSlugs, getAllBlogArticles, getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { addHeadingIds, extractMarkdownHeadings } from "@/lib/toc";
import { postMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { AdSlot } from "@bidev/ui";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ProseContent } from "@/components/blog/ProseContent";
import { Comments } from "@/components/blog/Comments";
import { ViewTracker } from "@/components/blog/ViewTracker";
import { BuyMeCoffee } from "@/components/BuyMeCoffee";
import { ProductPromoBanner } from "@/components/ProductPromoBanner";
import { TroubleshootingArticle } from "@/components/blog/TroubleshootingArticle";
import { articleJsonLd, howToJsonLd } from "@bidev/shared";
import { ArticleHero } from "@/components/blog/ArticleHero";
import { ArticleSidebar } from "@/components/blog/ArticleSidebar";
import { AuthorBox } from "@/components/blog/AuthorBox";
import { RelatedToolBanner } from "@/components/blog/RelatedToolBanner";
import { PrevNextArticles } from "@/components/blog/PrevNextArticles";
import { pickAdjacent } from "@/lib/adjacent";
import { toolSlugForTags } from "@/lib/article-tools";
import { TOOLS } from "@/lib/tools";

export const revalidate  = 60;
export const dynamicParams = true;

const SITE_URL  = "https://bidev.dev";
const SITE_NAME = "BiDev";

export async function generateStaticParams() {
  const slugs = await getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);
  if (!post) return {};
  return postMetadata(post);
}

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
      [rehypePrettyCode, { theme: "github-dark", keepBackground: false }],
    ] as any,
  },
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getArticleBySlug(slug);
  if (!post) notFound();

  const related   = await getRelatedArticles(post, 3);
  const postUrl   = `${SITE_URL}/blog/${post.slug}`;

  const { prev, next } = pickAdjacent(await getAllBlogArticles(), post.slug);
  const toolSlug = toolSlugForTags(post.tags);
  const relatedTool = toolSlug ? TOOLS.find((t) => t.slug === toolSlug) ?? null : null;

  const toc = post.source === "db"
    ? addHeadingIds(post.content)
    : { html: post.content, headings: extractMarkdownHeadings(post.content) };

  const wordCount = post.content
    ? Math.round(post.content.replace(/<[^>]*>/g, "").split(/\s+/).filter(Boolean).length)
    : undefined;

  const articleSchema = articleJsonLd({
    url:         postUrl,
    siteUrl:     SITE_URL,
    title:       post.title,
    description: post.summary,
    publishedAt: post.publishedAt,
    updatedAt:   post.updatedAt,
    authorName:  post.author ?? "Bilal Fali",
    authorUrl:   `${SITE_URL}/about`,
    siteName:    SITE_NAME,
    image:       post.image,
    wordCount,
  });

  const breadcrumbSchema = post.isTroubleshooting
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Troubleshooting", item: `${SITE_URL}/troubleshooting` },
          ...(post.troubleshootingCategorySlug
            ? [{ "@type": "ListItem", position: 3, name: post.troubleshootingCategory, item: `${SITE_URL}/troubleshooting/${post.troubleshootingCategorySlug}` }]
            : []),
          { "@type": "ListItem", position: post.troubleshootingCategorySlug ? 4 : 3, name: post.title, item: postUrl },
        ],
      }
    : {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home",  item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog",  item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
        ],
      };

  if (post.isTroubleshooting) {
    const resolveLinks = async (slugs?: string[]) => {
      if (!slugs || slugs.length === 0) return [];
      const resolved = await Promise.all(slugs.map((s) => getArticleBySlug(s)));
      return resolved
        .filter((a): a is NonNullable<typeof a> => Boolean(a))
        .map((a) => ({ slug: a.slug, title: a.title }));
    };

    const [relatedProblems, relatedGuides] = await Promise.all([
      resolveLinks(post.relatedProblems),
      resolveLinks(post.relatedGuides),
    ]);

    // Troubleshooting entries are structurally step-by-step fixes already
    // (post.solutions) — HowTo schema represents that accurately, unlike
    // treating them as a plain Article with no real body content.
    const howToSchema = post.solutions && post.solutions.length > 0
      ? howToJsonLd({
          name: post.title,
          description: post.summary,
          steps: post.solutions.map((s) => ({ title: s.title, content: s.content })),
        })
      : null;

    return (
      <>
        <ReadingProgress />
        <ViewTracker slug={post.slug} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {howToSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
        )}
        <TroubleshootingArticle
          post={post}
          postUrl={postUrl}
          relatedProblems={relatedProblems}
          relatedGuides={relatedGuides}
        />
      </>
    );
  }

  return (
    <>
      <ReadingProgress />
      <ViewTracker slug={post.slug} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10">
        <ArticleHero post={post} postUrl={postUrl} />

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <ArticleSidebar headings={toc.headings} />

          <article className="w-full lg:max-w-[840px] min-w-0">
            {post.image && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 border border-border">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 840px"
                  className="object-cover"
                  priority
                  fetchPriority="high"
                />
              </div>
            )}

            <AdSlot type="banner" className="mb-10" />

            <ProseContent>
              {post.source === "db" ? (
                <div dangerouslySetInnerHTML={{ __html: toc.html }} />
              ) : (
                <MDXRemote source={post.content} options={mdxOptions} />
              )}
            </ProseContent>

            <AdSlot type="in-article" className="my-10" />

            {post.tags.length > 0 && (
              <div className="mt-10 pt-8 border-t border-border">
                <p className="text-xs font-mono text-ink-faint mb-3">// tagged in</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/blog?tag=${encodeURIComponent(t)}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-bg-card border border-border text-ink-muted hover:border-accent/40 hover:text-accent-light transition-colors"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-10 flex flex-col gap-6">
              <AuthorBox />
              {relatedTool && <RelatedToolBanner tool={relatedTool} />}
              <PrevNextArticles prev={prev} next={next} />
            </div>

            {related.length > 0 && <RelatedPosts posts={related} />}

            <ProductPromoBanner />
            <BuyMeCoffee variant="banner" />

            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-base font-semibold text-ink mb-6">Comments</h2>
              <Comments slug={post.slug} />
            </div>
          </article>
        </div>
      </div>
    </>
  );
}
