"use client";

import {
  Column,
  Flex,
  Heading,
  SmartImage,
  SmartLink,
  Tag,
  Text,
} from "@/once-ui/components";
import styles from "./Posts.module.scss";
import { Post as BlogPost } from "@/services/blog";

interface SupabasePostProps {
  post: BlogPost;
  thumbnail?: boolean;
  direction?: "row" | "column";
}

export default function SupabasePost({
  post,
  thumbnail = true,
  direction = "column",
}: SupabasePostProps) {
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SmartLink
      fillWidth
      unstyled
      style={{ borderRadius: "var(--radius-l)" }}
      key={post.slug}
      href={`/blog/supabase/${post.slug}`}
    >
      <Flex
        position="relative"
        transition="micro-medium"
        direction={direction}
        radius="l"
        className={styles.hover}
        mobileDirection="column"
        fillWidth
      >
        {thumbnail && post.cover_image && (
          <SmartImage
            priority
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 640px"
            border="neutral-alpha-weak"
            cursor="interactive"
            radius="l"
            src={post.cover_image}
            alt={"Thumbnail of " + post.title_en}
            aspectRatio="16 / 9"
          />
        )}
        <Column
          position="relative"
          fillWidth
          gap="8"
          paddingY="20"
          paddingX={direction === "row" ? "24" : "0"}
          vertical="center"
        >
          <Text variant="label-default-s" onBackground="neutral-weak">
            {formatDate(post.created_at)}
          </Text>
          <Heading as="h2" variant="heading-strong-m" wrap="balance">
            {post.title_en}
          </Heading>
          {post.excerpt_en && (
            <Text
              variant="body-default-s"
              onBackground="neutral-weak"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {post.excerpt_en}
            </Text>
          )}
          {post.category && (
            <Tag
              style={{ marginTop: "8px" }}
              label={post.category.name_en}
              variant="neutral"
            />
          )}
        </Column>
      </Flex>
    </SmartLink>
  );
}
