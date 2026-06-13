import { Column, Heading } from "@/once-ui/components";
import { SupabasePosts } from "@/components/blog/SupabasePosts";
import { baseURL } from "@/app/resources";
import { Meta, Schema } from "@/once-ui/modules";
import { person } from "@/app/resources/content";

export async function generateMetadata() {
  return Meta.generate({
    title: "Blog Posts from Supabase",
    description: "Read the latest blog posts powered by Supabase",
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent("Blog Posts")}`,
    path: "/blog/supabase",
  });
}

export default function SupabaseBlogPage() {
  return (
    <Column maxWidth="s">
      <Schema
        as="blog"
        baseURL={baseURL}
        title="Blog Posts from Supabase"
        description="Read the latest blog posts powered by Supabase"
        path="/blog/supabase"
        image={`${baseURL}/og?title=${encodeURIComponent("Blog Posts")}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Heading marginBottom="l" variant="display-strong-s">
        Latest Blog Posts
      </Heading>
      <SupabasePosts limit={20} />
    </Column>
  );
}
