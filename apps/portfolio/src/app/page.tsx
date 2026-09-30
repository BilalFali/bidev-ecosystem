import React from "react";

import {
  Heading,
  Flex,
  Text,
  Button,
  RevealFx,
  Column,
  Row,
  Icon,
  Card,
  Grid,
} from "@/once-ui/components";

import { baseURL } from "@/app/resources";
import { home, about, person, newsletter } from "@/app/resources/content";
import { Mailchimp } from "@/components";
import { Meta, Schema } from "@/once-ui/modules";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
  });
}

export default function Home() {
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
                id="explore-work"
                data-border="rounded"
                href="/work"
                variant="primary"
                size="l"
                suffixIcon="chevronRight"
              >
                See My Work
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
            </Flex>
          </RevealFx>
        </Column>
      </Column>

      {/* More from BiDev */}
      <RevealFx translateY="16" delay={0.4} fillWidth>
        <Column fillWidth gap="l">
          <Column gap="4">
            <Heading as="h2" variant="display-strong-s" wrap="balance">
              More from BiDev
            </Heading>
            <Text variant="body-default-m" onBackground="neutral-weak">
              My Flutter articles and free developer tools live on bidev.dev.
            </Text>
          </Column>

          <Grid columns="2" mobileColumns="1" gap="m">
            <Card
              href="https://bidev.dev/blog"
              padding="m"
              radius="l"
              border="neutral-alpha-medium"
              background="surface"
            >
              <Row gap="m" vertical="center">
                <Row
                  padding="s"
                  radius="m"
                  background="brand-alpha-weak"
                  horizontal="center"
                  vertical="center"
                  style={{ width: "fit-content" }}
                >
                  <Icon name="book" size="m" onBackground="brand-strong" />
                </Row>
                <Column gap="4" style={{ flex: 1 }}>
                  <Text variant="heading-strong-s">Blog</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    Flutter tutorials, Firebase guides, and mobile dev articles.
                  </Text>
                </Column>
                <Icon name="chevronRight" size="s" onBackground="neutral-weak" />
              </Row>
            </Card>

            <Card
              href="https://bidev.dev/tools"
              padding="m"
              radius="l"
              border="neutral-alpha-medium"
              background="surface"
            >
              <Row gap="m" vertical="center">
                <Row
                  padding="s"
                  radius="m"
                  background="brand-alpha-weak"
                  horizontal="center"
                  vertical="center"
                  style={{ width: "fit-content" }}
                >
                  <Icon name="tools" size="m" onBackground="brand-strong" />
                </Row>
                <Column gap="4" style={{ flex: 1 }}>
                  <Text variant="heading-strong-s">Developer Tools</Text>
                  <Text variant="body-default-s" onBackground="neutral-weak">
                    JSON formatter, QR generator, password generator, and more.
                  </Text>
                </Column>
                <Icon name="chevronRight" size="s" onBackground="neutral-weak" />
              </Row>
            </Card>
          </Grid>
        </Column>
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
