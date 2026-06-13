"use client";

import { useState, useCallback } from "react";
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  Icon,
  Badge,
  Textarea,
} from "@/once-ui/components";

type Status = "idle" | "valid" | "invalid";

interface ParseResult {
  status: Status;
  formatted: string;
  error: string | null;
  stats: { keys: number; depth: number; size: string } | null;
}

function countKeys(obj: unknown): number {
  if (typeof obj !== "object" || obj === null) return 0;
  if (Array.isArray(obj)) return obj.reduce((acc: number, v) => acc + countKeys(v), 0);
  const vals = Object.values(obj as Record<string, unknown>);
  return vals.length + vals.reduce((acc: number, v) => acc + countKeys(v), 0);
}

function getDepth(obj: unknown, d = 0): number {
  if (typeof obj !== "object" || obj === null) return d;
  const children = Array.isArray(obj) ? obj : Object.values(obj as Record<string, unknown>);
  if (!children.length) return d;
  return Math.max(...children.map((v) => getDepth(v, d + 1)));
}

function fmtBytes(n: number) {
  return n < 1024 ? `${n} B` : `${(n / 1024).toFixed(1)} KB`;
}

function parseJSON(raw: string): ParseResult {
  const trimmed = raw.trim();
  if (!trimmed) return { status: "idle", formatted: "", error: null, stats: null };
  try {
    const parsed    = JSON.parse(trimmed);
    const formatted = JSON.stringify(parsed, null, 2);
    return {
      status: "valid",
      formatted,
      error: null,
      stats: {
        keys:  countKeys(parsed),
        depth: getDepth(parsed),
        size:  fmtBytes(new TextEncoder().encode(formatted).length),
      },
    };
  } catch (e) {
    return { status: "invalid", formatted: trimmed, error: (e as Error).message, stats: null };
  }
}

const SAMPLE = `{
  "name": "bidev",
  "version": "1.0.0",
  "description": "Developer tools for Flutter developers",
  "author": {
    "name": "Bilal Fali",
    "url": "https://bidev.site"
  },
  "tools": ["QR Generator", "JSON Formatter", "Password Generator"],
  "active": true
}`;

export default function JSONFormatterClient() {
  const [input,      setInput]      = useState("");
  const [result,     setResult]     = useState<ParseResult>({ status: "idle", formatted: "", error: null, stats: null });
  const [output,     setOutput]     = useState("");
  const [copied,     setCopied]     = useState(false);
  const [isMinified, setIsMinified] = useState(false);

  const process = useCallback((raw: string) => {
    const r = parseJSON(raw);
    setResult(r);
    setOutput(r.status === "valid" ? r.formatted : raw);
    setIsMinified(false);
  }, []);

  const handleInput = (raw: string) => { setInput(raw); process(raw); };

  const handleMinify = () => {
    if (result.status !== "valid") return;
    try {
      const m = JSON.stringify(JSON.parse(input));
      setOutput(m);
      setIsMinified(true);
    } catch {}
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setResult({ status: "idle", formatted: "", error: null, stats: null });
    setIsMinified(false);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output || input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Badge variant helpers (static, no template literals)
  const badgeBg =
    result.status === "valid"   ? "success-alpha-weak"  :
    result.status === "invalid" ? "danger-alpha-weak"   : "neutral-alpha-weak";

  const badgeOn =
    result.status === "valid"   ? "success-strong"  :
    result.status === "invalid" ? "danger-strong"   : "neutral-medium";

  const statusLabel =
    result.status === "valid"   ? "Valid JSON"   :
    result.status === "invalid" ? "Invalid JSON" : "Paste JSON to validate";

  return (
    <Column maxWidth="l" gap="xl" paddingY="32">
      {/* Breadcrumb */}
      <Row gap="8" vertical="center">
        <Button href="/tools" variant="tertiary" size="s" prefixIcon="chevronLeft">Tools</Button>
        <Icon name="chevronRight" size="xs" onBackground="neutral-weak" />
        <Text variant="body-default-s" onBackground="neutral-weak">JSON Formatter</Text>
      </Row>

      {/* Header */}
      <Column gap="s">
        <Row gap="12" vertical="center">
          <Row padding="s" radius="m" background="brand-alpha-weak" horizontal="center" vertical="center">
            <Icon name="document" size="m" onBackground="brand-strong" />
          </Row>
          <Heading variant="display-strong-m">JSON Formatter & Validator</Heading>
        </Row>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Paste JSON to format, validate, or minify it — 100% client-side.
        </Text>
      </Column>

      {/* AdSense top */}
      <Row fillWidth padding="16" radius="m" border="neutral-alpha-weak" background="neutral-alpha-weak"
        horizontal="center" vertical="center" style={{ minHeight: "90px" }}>
        <Text variant="label-default-s" onBackground="neutral-weak">[ Advertisement ]</Text>
      </Row>

      {/* Status bar */}
      <Row gap="12" vertical="center" horizontal="space-between" fillWidth wrap>
        <Row gap="12" vertical="center">
          <Badge
            background={badgeBg as any}
            paddingX="12"
            paddingY="4"
            textVariant="label-default-s"
            onBackground={badgeOn as any}
          >
            <Row gap="4" vertical="center">
              {result.status === "valid"   && <Icon name="checkCircle" size="xs" onBackground="success-strong" />}
              {result.status === "invalid" && <Icon name="errorCircle" size="xs" onBackground="danger-strong" />}
              <Text variant="label-default-s" onBackground={badgeOn as any}>{statusLabel}</Text>
            </Row>
          </Badge>
          {result.stats && (
            <>
              <Text variant="label-default-s" onBackground="neutral-weak">{result.stats.keys} keys</Text>
              <Text variant="label-default-s" onBackground="neutral-weak">depth {result.stats.depth}</Text>
              <Text variant="label-default-s" onBackground="neutral-weak">{result.stats.size}</Text>
            </>
          )}
        </Row>
        <Row gap="8">
          <Button variant="tertiary" size="s" onClick={() => handleInput(SAMPLE)}>Load Sample</Button>
          <Button variant="tertiary" size="s" onClick={handleClear} prefixIcon="close">Clear</Button>
        </Row>
      </Row>

      {/* Error message */}
      {result.error && (
        <Row gap="8" vertical="center" padding="12" radius="m" background="danger-alpha-weak" border="danger-alpha-medium">
          <Icon name="errorCircle" size="s" onBackground="danger-strong" />
          <Text variant="body-default-s" onBackground="danger-strong">
            {result.error}
          </Text>
        </Row>
      )}

      {/* Editors */}
      <Row gap="l" fillWidth wrap>
        {/* Input */}
        <Column gap="s" style={{ flex: 1, minWidth: "280px" }}>
          <Row gap="8" vertical="center" horizontal="space-between">
            <Text variant="label-strong-s" onBackground="neutral-medium">INPUT</Text>
            <Button variant="tertiary" size="s" onClick={() => process(input)} prefixIcon="refresh">Format</Button>
          </Row>
          <Textarea
            id="json-input"
            label="Paste your JSON here"
            labelAsPlaceholder
            lines={18}
            resize="vertical"
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            error={result.status === "invalid"}
            spellCheck={false}
            style={{ fontFamily: "var(--font-code, monospace)", fontSize: "13px", lineHeight: "1.6" }}
          />
        </Column>

        {/* Output */}
        <Column gap="s" style={{ flex: 1, minWidth: "280px" }}>
          <Row gap="8" vertical="center" horizontal="space-between">
            <Row gap="8" vertical="center">
              <Text variant="label-strong-s" onBackground="neutral-medium">OUTPUT</Text>
              {isMinified && (
                <Badge background="neutral-alpha-weak" paddingX="8" paddingY="4" textVariant="label-default-xs">
                  minified
                </Badge>
              )}
            </Row>
            <Row gap="8">
              <Button variant="tertiary" size="s" onClick={handleMinify} disabled={result.status !== "valid"}>
                Minify
              </Button>
              <Button variant="tertiary" size="s" onClick={handleCopy} prefixIcon="clipboard"
                disabled={result.status === "idle"}>
                {copied ? "Copied!" : "Copy"}
              </Button>
            </Row>
          </Row>
          <Textarea
            id="json-output"
            label="Formatted output"
            labelAsPlaceholder
            lines={18}
            resize="vertical"
            value={output}
            readOnly
            spellCheck={false}
            style={{ fontFamily: "var(--font-code, monospace)", fontSize: "13px", lineHeight: "1.6" }}
          />
        </Column>
      </Row>

      {/* AdSense middle */}
      <Row fillWidth padding="16" radius="m" border="neutral-alpha-weak" background="neutral-alpha-weak"
        horizontal="center" vertical="center" style={{ minHeight: "90px" }}>
        <Text variant="label-default-s" onBackground="neutral-weak">[ Advertisement ]</Text>
      </Row>

      {/* SEO content */}
      <Column gap="m">
        <Heading as="h2" variant="heading-strong-m">About JSON Formatter & Validator</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          This tool formats and validates JSON entirely in your browser — no data is ever sent to a server.
          Paste raw or minified JSON to get a readable, indented output. Syntax errors are shown with a
          descriptive message so you can fix issues instantly.
        </Text>
        <Heading as="h3" variant="heading-strong-s">Features</Heading>
        <Column gap="8">
          {[
            "Real-time validation as you type",
            "Pretty-print formatting with 2-space indent",
            "JSON minification — strip all whitespace",
            "Key count, nesting depth, and output size stats",
            "Copy output to clipboard in one click",
            "100% client-side — your data never leaves the browser",
          ].map((f) => (
            <Row key={f} gap="8" vertical="center">
              <Icon name="checkCircle" size="s" onBackground="success-strong" />
              <Text variant="body-default-s" onBackground="neutral-weak">{f}</Text>
            </Row>
          ))}
        </Column>
      </Column>
    </Column>
  );
}
