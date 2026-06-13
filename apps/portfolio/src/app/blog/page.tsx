import { Column, Heading, Text } from "@/once-ui/components";
import { Mailchimp } from "@/components";
import { SupabasePosts } from "@/components/blog/SupabasePosts";
import { baseURL } from "@/app/resources";
import { blog, person, newsletter } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";

// Force dynamic rendering to fetch fresh data from Supabase
export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return Meta.generate({
    title: blog.title,
    description: blog.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(blog.title)}`,
    path: blog.path,
  });
}

export default function Blog() {
  return (
    <Column maxWidth="m">
      <Schema
        as="blog"
        baseURL={baseURL}
        title={blog.title}
        description={blog.description}
        path={blog.path}
        image={`${baseURL}/og?title=${encodeURIComponent(blog.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="display-strong-s">
        {blog.title}
      </Heading>

      {/* Blog Posts from Supabase */}
      <Column fillWidth flex={1} marginBottom="xl">
        <SupabasePosts limit={20} columns="2" thumbnail={true} />
      </Column>

      {newsletter.display && <Mailchimp newsletter={newsletter} />}
    </Column>
  );
}
