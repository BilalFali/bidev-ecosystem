import React from "react";

import {
  Heading,
  Flex,
  Text,
  Button,
  RevealFx,
  Column,
  Badge,
  Row,
  Icon,
  Card,
  Grid,
} from "@/once-ui/components";

import { baseURL, routes } from "@/app/resources";
import { home, about, person, newsletter } from "@/app/resources/content";
import { Mailchimp } from "@/components";
import { Meta, Schema } from "@/once-ui/modules";
import { getPosts } from "@/app/utils/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
  });
}

const featuredTools = [
  {
    href: "/tools/qr-generator",
    icon: "tools" as const,
    title: "QR Code Generator",
    description: "Generate QR codes for URLs, text, email instantly.",
  },
  {
    href: "/tools/json-formatter",
    icon: "document" as const,
    title: "JSON Formatter",
    description: "Format and validate JSON with real-time error detection.",
  },
  {
    href: "/tools/password-generator",
    icon: "eyeOff" as const,
    title: "Password Generator",
    description: "Cryptographically secure passwords with strength indicator.",
  },
];

export default function Home() {
  const posts = getPosts(["src", "app", "blog", "posts"])
    .sort((a, b) => new Date(b.metadata.publishedAt).getTime() - new Date(a.metadata.publishedAt).getTime())
    .slice(0, 3);

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`${baseURL}/og?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Hero Section */}
      <Column fillWidth paddingY="40" gap="l">
        <Column maxWidth="s" gap="m">
          {home.featured && (
            <RevealFx fillWidth horizontal="start" paddingBottom="16">
              <Badge
                background="brand-alpha-weak"
                paddingX="16"
                paddingY="8"
                onBackground="neutral-strong"
                textVariant="label-default-m"
                arrow={true}
                href={home.featured.href}
              >
                <Row paddingY="4" gap="8">
                  <Text variant="label-default-s">⚡</Text>
                  {home.featured.title}
                </Row>
              </Badge>
            </RevealFx>
          )}

          <RevealFx translateY="4" fillWidth horizontal="start">
            <Heading wrap="balance" variant="display-strong-xl">
              {home.headline}
            </Heading>
          </RevealFx>

          <RevealFx
            translateY="8"
            delay={0.1}
            fillWidth
            horizontal="start"
            paddingTop="8"
          >
            <Text
              wrap="balance"
              onBackground="neutral-weak"
              variant="heading-default-l"
            >
              {home.subline}
            </Text>
          </RevealFx>

          {/* CTA Buttons */}
          <RevealFx paddingTop="32" delay={0.2} horizontal="start">
            <Flex gap="12" wrap>
              <Button
                id="start-reading"
                data-border="rounded"
                href="/blog"
                variant="primary"
                size="l"
                suffixIcon="chevronRight"
              >
                Start Reading
              </Button>
              <Button
                id="explore-tools"
                data-border="rounded"
                href="/tools"
                variant="secondary"
                size="l"
                prefixIcon="tools"
              >
                Explore Tools
              </Button>
              <Button
                id="about"
                data-border="rounded"
                href={about.path}
                variant="tertiary"
                size="l"
              >
                About
              </Button>
            </Flex>
          </RevealFx>

          {/* Stats */}
          <RevealFx paddingTop="48" delay={0.3} fillWidth>
            <Flex fillWidth gap="32" wrap>
              <Column gap="4">
                <Heading variant="display-strong-s" onBackground="brand-strong">5+</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">Years in Flutter</Text>
              </Column>
              <Column gap="4">
                <Heading variant="display-strong-s" onBackground="brand-strong">100K+</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">App Users</Text>
              </Column>
              <Column gap="4">
                <Heading variant="display-strong-s" onBackground="brand-strong">3</Heading>
                <Text variant="body-default-s" onBackground="neutral-weak">Free Tools</Text>
              </Column>
            </Flex>
          </RevealFx>
        </Column>
      </Column>

      {/* AdSense placeholder — top */}
      <RevealFx translateY="8" delay={0.3} fillWidth>
        <Row
          fillWidth padding="16" radius="m" border="neutral-alpha-weak"
          background="neutral-alpha-weak" horizontal="center" vertical="center"
          style={{ minHeight: "90px" }}
        >
          <Text variant="label-default-s" onBackground="neutral-weak">[ Advertisement ]</Text>
        </Row>
      </RevealFx>

      {/* Tools Section */}
      {routes["/tools"] && (
        <RevealFx translateY="16" delay={0.4} fillWidth>
          <Column fillWidth gap="l">
            <Flex fillWidth horizontal="space-between" vertical="center" wrap>
              <Column gap="4">
                <Heading as="h2" variant="display-strong-s" wrap="balance">
                  Free Developer Tools
                </Heading>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  Client-side, fast, no account needed.
                </Text>
              </Column>
              <Button
                href="/tools"
                variant="tertiary"
                size="s"
                suffixIcon="chevronRight"
              >
                All tools
              </Button>
            </Flex>

            <Grid columns="3" mobileColumns="1" gap="m">
              {featuredTools.map((tool) => (
                <Card
                  key={tool.href}
                  href={tool.href}
                  padding="m"
                  radius="l"
                  border="neutral-alpha-medium"
                  background="surface"
                >
                  <Column gap="m">
                    <Row
                      padding="s"
                      radius="m"
                      background="brand-alpha-weak"
                      horizontal="center"
                      vertical="center"
                      style={{ width: "fit-content" }}
                    >
                      <Icon name={tool.icon} size="m" onBackground="brand-strong" />
                    </Row>
                    <Column gap="4">
                      <Text variant="heading-strong-s">{tool.title}</Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {tool.description}
                      </Text>
                    </Column>
                  </Column>
                </Card>
              ))}
            </Grid>
          </Column>
        </RevealFx>
      )}

      {/* Blog Section */}
      {routes["/blog"] && posts.length > 0 && (
        <RevealFx translateY="16" delay={0.5} fillWidth>
          <Column fillWidth gap="l">
            <Flex fillWidth horizontal="space-between" vertical="center" wrap>
              <Column gap="4">
                <Heading as="h2" variant="display-strong-s" wrap="balance">
                  Latest Articles
                </Heading>
                <Text variant="body-default-m" onBackground="neutral-weak">
                  Flutter, mobile dev, Firebase, and AI tools.
                </Text>
              </Column>
              <Button href="/blog" variant="tertiary" size="s" suffixIcon="chevronRight">
                All articles
              </Button>
            </Flex>

            <Column gap="m" fillWidth>
              {posts.map((post) => (
                <Card
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  padding="m"
                  radius="l"
                  border="neutral-alpha-medium"
                  background="surface"
                >
                  <Row gap="m" vertical="start" wrap>
                    <Column gap="s" style={{ flex: 1 }}>
                      <Row gap="8" vertical="center">
                        {post.metadata.tag && (
                          <Badge
                            background="brand-alpha-weak"
                            paddingX="8"
                            paddingY="4"
                            textVariant="label-default-xs"
                            onBackground="brand-strong"
                          >
                            {post.metadata.tag}
                          </Badge>
                        )}
                        <Text variant="label-default-xs" onBackground="neutral-weak">
                          {new Date(post.metadata.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </Text>
                      </Row>
                      <Text variant="heading-strong-m">{post.metadata.title}</Text>
                      <Text variant="body-default-s" onBackground="neutral-weak">
                        {post.metadata.summary}
                      </Text>
                    </Column>
                    <Icon name="chevronRight" size="s" onBackground="neutral-weak" style={{ flexShrink: 0, marginTop: "4px" }} />
                  </Row>
                </Card>
              ))}
            </Column>
          </Column>
        </RevealFx>
      )}

      {/* AdSense placeholder — middle */}
      <RevealFx translateY="8" delay={0.5} fillWidth>
        <Row
          fillWidth padding="16" radius="m" border="neutral-alpha-weak"
          background="neutral-alpha-weak" horizontal="center" vertical="center"
          style={{ minHeight: "90px" }}
        >
          <Text variant="label-default-s" onBackground="neutral-weak">[ Advertisement ]</Text>
        </Row>
      </RevealFx>

      {/* Newsletter */}
      {newsletter.display && (
        <RevealFx translateY="16" delay={0.6} fillWidth>
          <Mailchimp newsletter={newsletter} />
        </RevealFx>
      )}
    </Column>
  );
}
