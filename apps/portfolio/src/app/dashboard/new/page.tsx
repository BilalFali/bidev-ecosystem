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

export default function NewPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

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
    checkAuth();
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
      return;
    }
    setCheckingAuth(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!supabase) {
        setError("Database is not configured");
        return;
      }

      const slug = formData.slug || generateSlug(formData.title_en);

      const { error } = await supabase.from("posts").insert([
        {
          title_en: formData.title_en,
          title_ar: formData.title_ar || formData.title_en,
          slug: slug,
          excerpt_en: formData.excerpt_en,
          excerpt_ar: formData.excerpt_ar || formData.excerpt_en,
          content_en: formData.content_en,
          content_ar: formData.content_ar || formData.content_en,
          cover_image: formData.cover_image || null,
          published: formData.published,
          language: "en",
        },
      ]);

      if (error) throw error;

      router.push("/dashboard");
    } catch (error: any) {
      setError(error.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <Column maxWidth="m" fillWidth paddingY="xl" horizontal="center">
        <Text>Loading...</Text>
      </Column>
    );
  }

  return (
    <Column maxWidth="m" fillWidth gap="l" paddingY="xl">
      <Flex fillWidth horizontal="space-between" vertical="center">
        <Column gap="s">
          <Heading variant="display-strong-l">New Post</Heading>
          <Text variant="body-default-m" onBackground="neutral-weak">
            Create a new blog post
          </Text>
        </Column>
        <Button href="/dashboard" variant="secondary" size="m">
          Back
        </Button>
      </Flex>

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <Column gap="m" fillWidth>
          <Input
            id="title_en"
            label="Title (English) *"
            value={formData.title_en}
            onChange={(e) =>
              setFormData({ ...formData, title_en: e.target.value })
            }
            required
          />

          <Input
            id="title_ar"
            label="Title (Arabic)"
            value={formData.title_ar}
            onChange={(e) =>
              setFormData({ ...formData, title_ar: e.target.value })
            }
            placeholder="Optional - uses English title if empty"
          />

          <Input
            id="slug"
            label="Slug (URL)"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            placeholder="auto-generated-from-title"
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
              <Text variant="body-default-m">Publish immediately</Text>
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
            <Button type="submit" variant="primary" size="l" disabled={loading}>
              {loading ? "Creating..." : "Create Post"}
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
