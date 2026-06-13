"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Column,
  Heading,
  Text,
  Button,
  Input,
  Flex,
} from "@/once-ui/components";

export default function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [postId, setPostId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    slug: "",
    excerpt_en: "",
    excerpt_ar: "",
    content_en: "",
    content_ar: "",
    cover_image: "",
    published: false,
  });

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setPostId(resolvedParams.id);
      checkAuth();
      loadPost(resolvedParams.id);
    };
    init();
  }, []);

  const checkAuth = async () => {
    if (!supabase) {
      router.push("/");
      return;
    }
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
    }
  };

  const loadPost = async (id: string) => {
    try {
      if (!supabase) {
        setError("Database is not configured");
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          title_en: data.title_en || "",
          title_ar: data.title_ar || "",
          slug: data.slug || "",
          excerpt_en: data.excerpt_en || "",
          excerpt_ar: data.excerpt_ar || "",
          content_en: data.content_en || "",
          content_ar: data.content_ar || "",
          cover_image: data.cover_image || "",
          published: data.published || false,
        });
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (!supabase) {
        setError("Database is not configured");
        return;
      }
      const { error } = await supabase
        .from("posts")
        .update(formData)
        .eq("id", postId);

      if (error) throw error;

      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Column maxWidth="m" fillWidth paddingY="xl">
        <Text>Loading...</Text>
      </Column>
    );
  }

  return (
    <Column maxWidth="m" fillWidth gap="l" paddingY="xl">
      <Flex fillWidth horizontal="space-between" vertical="center">
        <Column gap="s">
          <Heading variant="display-strong-l">Edit Post</Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Update your blog post
          </Text>
        </Column>
        <Button href="/dashboard" variant="secondary" size="m">
          Cancel
        </Button>
      </Flex>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Column gap="m" fillWidth>
          <Input
            id="title_en"
            label="Title (English)"
            value={formData.title_en}
            onChange={(e) =>
              setFormData({ ...formData, title_en: e.target.value })
            }
            required
          />

          <Input
            id="slug"
            label="Slug (URL)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />

          <Column gap="xs">
            <label htmlFor="excerpt_en">
              <Text variant="label-default-s">Excerpt (English)</Text>
            </label>
            <textarea
              id="excerpt_en"
              value={formData.excerpt_en}
              onChange={(e) =>
                setFormData({ ...formData, excerpt_en: e.target.value })
              }
              rows={3}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-m)",
                border: "1px solid var(--neutral-border-medium)",
                background: "var(--surface-background)",
                color: "var(--neutral-on-background-strong)",
                fontFamily: "inherit",
                fontSize: "inherit",
                resize: "vertical",
              }}
              placeholder="Short description of the post..."
            />
          </Column>

          <Column gap="xs">
            <label htmlFor="content_en">
              <Text variant="label-default-s">Content (English) *</Text>
            </label>
            <textarea
              id="content_en"
              value={formData.content_en}
              onChange={(e) =>
                setFormData({ ...formData, content_en: e.target.value })
              }
              rows={15}
              required
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "var(--radius-m)",
                border: "1px solid var(--neutral-border-medium)",
                background: "var(--surface-background)",
                color: "var(--neutral-on-background-strong)",
                fontFamily: "inherit",
                fontSize: "inherit",
                resize: "vertical",
              }}
              placeholder="Write your post content here..."
            />
          </Column>

          <Input
            id="cover_image"
            label="Cover Image URL"
            value={formData.cover_image}
            onChange={(e) =>
              setFormData({ ...formData, cover_image: e.target.value })
            }
            placeholder="https://example.com/image.jpg"
          />

          <Flex gap="s" vertical="center">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              style={{ width: "18px", height: "18px", cursor: "pointer" }}
            />
            <label htmlFor="published" style={{ cursor: "pointer" }}>
              <Text variant="body-default-m">Published</Text>
            </label>
          </Flex>

          {error && (
            <Flex
              padding="m"
              radius="m"
              style={{ background: "var(--danger-alpha-weak)" }}
            >
              <Text
                variant="body-default-s"
                style={{ color: "var(--danger-solid-strong)" }}
              >
                {error}
              </Text>
            </Flex>
          )}

          <Flex gap="m" paddingTop="m">
            <Button type="submit" variant="primary" size="l" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            <Button href="/dashboard" variant="secondary" size="l">
              Cancel
            </Button>
          </Flex>
        </Column>
      </form>
    </Column>
  );
}
