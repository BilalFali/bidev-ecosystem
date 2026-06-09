import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import Link from "next/link";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/articles";
import { getRelatedPosts } from "@/lib/mdx";
import { postMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { AdSlot } from "@bidev/ui";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { ReadingProgress } from "@/components/blog/ReadingProgress";
import { ProseContent } from "@/components/blog/ProseContent";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { Comments } from "@/components/blog/Comments";
import { articleJsonLd } from "@bidev/shared";

export const revalidate  = 60;
export const dynamicParams = true;

const SITE_URL  = "https://bidev.site";
const SITE_NAME = "bidev.site";

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

  const related   = getRelatedPosts(post, 3);
  const postUrl   = `${SITE_URL}/blog/${post.slug}`;

  const articleSchema = articleJsonLd({
    url:         postUrl,
    title:       post.title,
    description: post.summary,
    publishedAt: post.publishedAt,
    updatedAt:   post.updatedAt,
    authorName:  post.author ?? "Bilal Fali",
    siteName:    SITE_NAME,
    image:       post.image,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",  item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog",  item: `${SITE_URL}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <>
      <ReadingProgress />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-12">
          <article className="flex-1 min-w-0 max-w-3xl">

            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-faint mb-8">
              <Link href="/" className="hover:text-ink-muted transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/blog" className="hover:text-ink-muted transition-colors">Blog</Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink-muted truncate">{post.title}</span>
            </nav>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((t) => (
                <Link
                  key={t}
                  href={`/blog?tag=${encodeURIComponent(t)}`}
                  className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
                >
                  {t}
                </Link>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-5 leading-tight">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-ink-muted mb-8 pb-8 border-b border-border">
              <span className="font-medium text-ink">{post.author}</span>
              <span>·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span>·</span>
              <span>{post.readingTime} min read</span>
            </div>

            {/* Cover image */}
            {post.image && (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 border border-border">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 768px"
                  className="object-cover"
                  priority
                  fetchPriority="high"
                />
              </div>
            )}

            {/* Top Ad */}
            <AdSlot type="banner" className="mb-10" />

            {/* Article body — ProseContent injects copy buttons on every <pre> */}
            <ProseContent>
              {post.source === "db" ? (
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              ) : (
                <MDXRemote source={post.content} options={mdxOptions} />
              )}
            </ProseContent>

            {/* Middle Ad */}
            <AdSlot type="in-article" className="my-10" />

            {/* Share */}
            <div className="mt-10 pt-8 border-t border-border">
              <ShareButtons url={postUrl} title={post.title} />
            </div>

            {/* Tags footer */}
            <div className="mt-8 pt-8 border-t border-border">
              <p className="text-xs text-ink-faint uppercase tracking-wider mb-3">Tagged in</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    href={`/blog?tag=${encodeURIComponent(t)}`}
                    className="text-xs px-3 py-1.5 rounded-lg bg-bg-card border border-border text-ink-muted hover:border-accent/40 hover:text-accent transition-colors"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            </div>

            {/* Related posts */}
            {related.length > 0 && <RelatedPosts posts={related} />}

            {/* Comments */}
            <div className="mt-12 pt-8 border-t border-border">
              <h2 className="text-base font-semibold text-ink mb-6">Comments</h2>
              <Comments />
            </div>

          </article>

          {/* Sidebar */}
          <aside className="hidden xl:flex flex-col gap-6 w-64 flex-shrink-0">
            <div className="sticky top-24 flex flex-col gap-6">
              <TableOfContents content={post.content} />
              <AdSlot type="sidebar" />
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
