import { Post as BlogPost, blogService } from "@/services/blog";
import { Grid, Text, Column } from "@/once-ui/components";
import { isSupabaseConfigured } from "@/lib/supabase";
import SupabasePost from "./SupabasePost";

interface SupabasePostsProps {
  limit?: number;
  categorySlug?: string;
  tagSlug?: string;
  columns?: "1" | "2" | "3";
  thumbnail?: boolean;
  direction?: "row" | "column";
}

export async function SupabasePosts({
  limit = 10,
  categorySlug,
  tagSlug,
  columns = "3",
  thumbnail = true,
  direction = "column",
}: SupabasePostsProps) {
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    return (
      <Column fillWidth padding="24" horizontal="center">
        <Text variant="body-default-s" onBackground="neutral-weak">
          Blog posts will be available soon.
        </Text>
      </Column>
    );
  }

  try {
    const { data: posts } = await blogService.getPosts(
      1,
      limit,
      categorySlug,
      tagSlug,
    );

    if (posts.length === 0) {
      return (
        <Column fillWidth padding="24" horizontal="center">
          <Text variant="body-default-s" onBackground="neutral-weak">
            No blog posts available yet.
          </Text>
        </Column>
      );
    }

    return (
      <Grid
        columns={columns}
        mobileColumns="1"
        fillWidth
        marginBottom="40"
        gap="24"
      >
        {posts.map((post: BlogPost) => (
          <SupabasePost
            key={post.id}
            post={post}
            thumbnail={thumbnail}
            direction={direction}
          />
        ))}
      </Grid>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return (
      <Column fillWidth padding="24" horizontal="center">
        <Text variant="body-default-s" onBackground="neutral-weak">
          Unable to load blog posts at this time.
        </Text>
      </Column>
    );
  }
}
