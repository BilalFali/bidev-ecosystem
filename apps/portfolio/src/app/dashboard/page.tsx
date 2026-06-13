"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Column,
  Heading,
  Text,
  Button,
  Flex,
  Grid,
} from "@/once-ui/components";

interface Post {
  id: string;
  title_en: string;
  excerpt_en?: string;
  published: boolean;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    if (!supabase) {
      router.push("/");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
    } else {
      setUser(user);
      loadPosts();
    }
  };

  const loadPosts = async () => {
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from("posts")
        .select("id, title_en, excerpt_en, published, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error loading posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      if (!supabase) return;
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (error) throw error;

      // Refresh posts
      loadPosts();
    } catch (error: any) {
      alert("Error deleting post: " + error.message);
    }
  };

  if (loading) {
    return (
      <Column maxWidth="l" fillWidth paddingY="xl">
        <Text>Loading...</Text>
      </Column>
    );
  }

  return (
    <Column maxWidth="l" fillWidth gap="xl" paddingY="xl">
      <Flex fillWidth horizontal="space-between" vertical="center">
        <Column gap="s">
          <Heading variant="display-strong-l">Dashboard</Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Welcome, {user?.email}
          </Text>
        </Column>
        <Flex gap="m">
          <Button
            href="/dashboard/new"
            variant="primary"
            size="m"
            suffixIcon="chevronRight"
          >
            New Post
          </Button>
          <Button onClick={handleLogout} variant="secondary" size="m">
            Logout
          </Button>
        </Flex>
      </Flex>

      <Column gap="m" fillWidth>
        <Heading as="h2" variant="heading-strong-l">
          Your Posts ({posts.length})
        </Heading>

        {posts.length === 0 ? (
          <Text variant="body-default-m" onBackground="neutral-weak">
            No posts yet. Create your first post!
          </Text>
        ) : (
          <Grid columns="1" gap="m" fillWidth>
            {posts.map((post) => (
              <Flex
                key={post.id}
                fillWidth
                padding="m"
                gap="m"
                radius="m"
                border="neutral-medium"
                background="surface"
                horizontal="space-between"
                vertical="center"
              >
                <Column gap="xs" flex={1}>
                  <Heading as="h3" variant="heading-strong-m">
                    {post.title_en}
                  </Heading>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {post.excerpt_en}
                  </Text>
                  <Flex gap="s">
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      {post.published ? "Published" : "Draft"}
                    </Text>
                    <Text variant="label-default-s" onBackground="neutral-weak">
                      • {new Date(post.created_at).toLocaleDateString()}
                    </Text>
                  </Flex>
                </Column>

                <Flex gap="s">
                  <Button
                    href={`/dashboard/edit/${post.id}`}
                    variant="secondary"
                    size="s"
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(post.id)}
                    variant="tertiary"
                    size="s"
                  >
                    Delete
                  </Button>
                </Flex>
              </Flex>
            ))}
          </Grid>
        )}
      </Column>
    </Column>
  );
}
