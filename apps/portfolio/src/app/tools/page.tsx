import { Column, Heading, Text, Grid, Card, Button, Row, Icon, Badge } from "@/once-ui/components";
import { baseURL } from "@/app/resources";
import { tools, person } from "@/app/resources/content";
import { Meta, Schema } from "@/once-ui/modules";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: tools.title,
    description: tools.description,
    baseURL: baseURL,
    image: `${baseURL}/og?title=${encodeURIComponent(tools.title)}`,
    path: tools.path,
  });
}

const toolsList = [
  {
    href: "/tools/qr-generator",
    icon: "tools" as const,
    title: "QR Code Generator",
    description: "Generate QR codes instantly for URLs, text, emails, and more. Download as PNG for free.",
    badge: "Free",
    color: "brand" as const,
  },
  {
    href: "/tools/json-formatter",
    icon: "document" as const,
    title: "JSON Formatter & Validator",
    description: "Format, validate, and minify JSON data. Highlight syntax errors with detailed messages.",
    badge: "Free",
    color: "brand" as const,
  },
  {
    href: "/tools/password-generator",
    icon: "eyeOff" as const,
    title: "Password Generator",
    description: "Generate strong, secure passwords with custom length and character sets. Strength indicator included.",
    badge: "Free",
    color: "brand" as const,
  },
];

export default function ToolsPage() {
  return (
    <Column maxWidth="m" gap="xl">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={tools.path}
        title={tools.title}
        description={tools.description}
        image={`${baseURL}/og?title=${encodeURIComponent(tools.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}/about`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Header */}
      <Column gap="m" paddingTop="40">
        <Row gap="12" vertical="center">
          <Icon name="tools" size="l" onBackground="brand-strong" />
          <Badge background="brand-alpha-weak" paddingX="12" paddingY="4" textVariant="label-default-s">
            100% Free · Client-Side · No Sign-Up
          </Badge>
        </Row>
        <Heading variant="display-strong-l">
          Developer Tools
        </Heading>
        <Text variant="body-default-l" onBackground="neutral-weak" style={{ maxWidth: "560px" }}>
          A growing collection of free, fast, and privacy-friendly tools built for developers.
          Everything runs in your browser — no data is sent to any server.
        </Text>
      </Column>

      {/* AdSense placeholder — top */}
      <Row
        fillWidth
        padding="16"
        radius="m"
        border="neutral-alpha-weak"
        background="neutral-alpha-weak"
        horizontal="center"
        vertical="center"
        style={{ minHeight: "90px" }}
      >
        <Text variant="label-default-s" onBackground="neutral-weak">
          [ Advertisement ]
        </Text>
      </Row>

      {/* Tools Grid */}
      <Column gap="l">
        <Heading as="h2" variant="heading-strong-l">All Tools</Heading>
        <Grid columns="2" mobileColumns="1" gap="m">
          {toolsList.map((tool) => (
            <Card
              key={tool.href}
              href={tool.href}
              padding="l"
              radius="l"
              border="neutral-alpha-medium"
              background="surface"
              style={{ textDecoration: "none" }}
            >
              <Column gap="m">
                <Row gap="12" vertical="center" horizontal="space-between">
                  <Row
                    padding="s"
                    radius="m"
                    background="brand-alpha-weak"
                    horizontal="center"
                    vertical="center"
                  >
                    <Icon name={tool.icon} size="m" onBackground="brand-strong" />
                  </Row>
                  <Badge
                    background="brand-alpha-weak"
                    paddingX="12"
                    paddingY="4"
                    textVariant="label-default-xs"
                    onBackground="brand-strong"
                  >
                    {tool.badge}
                  </Badge>
                </Row>
                <Column gap="8">
                  <Text variant="heading-strong-m">{tool.title}</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    {tool.description}
                  </Text>
                </Column>
                <Row gap="8" vertical="center" onBackground="brand-strong" textVariant="label-default-s">
                  <Text variant="label-default-s" onBackground="brand-strong">Open tool</Text>
                  <Icon name="chevronRight" size="xs" onBackground="brand-strong" />
                </Row>
              </Column>
            </Card>
          ))}
        </Grid>
      </Column>

      {/* Bottom CTA */}
      <Column gap="m" paddingY="32" horizontal="center">
        <Heading as="h2" variant="heading-strong-m">More tools coming soon</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          We're building more developer tools. Follow on GitHub or subscribe to get notified.
        </Text>
        <Row gap="12">
          <Button href="/blog" variant="primary" size="m" suffixIcon="chevronRight">
            Read the blog
          </Button>
          <Button href="/about" variant="secondary" size="m">
            About bidev.dev
          </Button>
        </Row>
      </Column>
    </Column>
  );
}
