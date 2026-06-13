import { notFound } from "next/navigation";
import { Column, Heading, Text, Flex, Tag } from "@/once-ui/components";
import { blogService } from "@/services/blog";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";
import { person } from "@/app/resources/content";
import { marked } from "marked";
import "../blog-content.css";

// Force dynamic rendering for Supabase data
export const dynamic = 'force-dynamic';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await blogService.getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return Meta.generate({
    title: post.title_en,
    description: post.excerpt_en || post.title_en,
    baseURL: baseURL,
    image:
      post.cover_image ||
      `${baseURL}/og?title=${encodeURIComponent(post.title_en)}`,
    path: `/blog/supabase/${slug}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await blogService.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Convert markdown to HTML
  const htmlContent = marked(post.content_en);

  return (
    <>
      <Schema
        as="blogPosting"
        baseURL={baseURL}
        title={post.title_en}
        description={post.excerpt_en || ""}
        path={`/blog/supabase/${slug}`}
        image={post.cover_image || ""}
        author={{
          name: post.author?.name || person.name,
          url: `${baseURL}/blog`,
          image: post.author?.avatar_url || `${baseURL}${person.avatar}`,
        }}
        datePublished={post.created_at}
        dateModified={post.updated_at}
      />
      <Column maxWidth="s">
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title_en,
              datePublished: post.created_at,
              dateModified: post.updated_at,
              description: post.excerpt_en,
              image: post.cover_image
                ? `${baseURL}${post.cover_image}`
                : `${baseURL}/og?title=${encodeURIComponent(post.title_en)}`,
              url: `${baseURL}/blog/supabase/${slug}`,
              author: {
                "@type": "Person",
                name: post.author?.name || person.name,
              },
            }),
          }}
        />
        <Flex fillWidth direction="column" gap="m" marginBottom="xl">
          {post.cover_image && (
            <img
              src={post.cover_image}
              alt={post.title_en}
              style={{
                width: "100%",
                borderRadius: "var(--radius-l)",
                marginBottom: "var(--spacing-m)",
              }}
            />
          )}
          <Heading as="h1" variant="display-strong-l" wrap="balance">
            {post.title_en}
          </Heading>
          {post.excerpt_en && (
            <Text
              variant="body-default-l"
              onBackground="neutral-weak"
              marginBottom="m"
            >
              {post.excerpt_en}
            </Text>
          )}
          <Flex gap="s" wrap>
            {post.author && (
              <Text variant="label-default-s" onBackground="neutral-weak">
                By {post.author.name}
              </Text>
            )}
            <Text variant="label-default-s" onBackground="neutral-weak">
              •
            </Text>
            <Text variant="label-default-s" onBackground="neutral-weak">
              {formatDate(post.created_at)}
            </Text>
            {post.category && (
              <>
                <Text variant="label-default-s" onBackground="neutral-weak">
                  •
                </Text>
                <Tag label={post.category.name_en} variant="neutral" />
              </>
            )}
          </Flex>
          {post.tags && post.tags.length > 0 && (
            <Flex gap="s" wrap marginTop="s">
              {post.tags.map((tag) => (
                <Tag
                  key={tag.id}
                  label={tag.name_en}
                  variant="neutral"
                  size="s"
                />
              ))}
            </Flex>
          )}
        </Flex>

        {/* Blog Content */}
        <Column
          fillWidth
          gap="l"
          className="blog-content"
          style={{
            fontSize: "var(--font-size-body-m)",
            lineHeight: "1.7",
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </Column>
      </Column>
    </>
  );
}
