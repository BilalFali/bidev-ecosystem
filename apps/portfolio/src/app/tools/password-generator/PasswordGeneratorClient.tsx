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
} from "@/once-ui/components";

// ── Character sets ──────────────────────────────────────────────────────────
const CHARS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers:   "0123456789",
  symbols:   "!@#$%^&*()_+-=[]{}|;:,.<>?",
};

type CharOption = keyof typeof CHARS;

type StrengthLevel = "Very Weak" | "Weak" | "Fair" | "Strong" | "Very Strong";

interface Strength { level: StrengthLevel; score: number; color: string }

function getStrength(pw: string): Strength {
  let s = 0;
  if (pw.length >= 8)              s++;
  if (pw.length >= 14)             s++;
  if (/[A-Z]/.test(pw))           s++;
  if (/[a-z]/.test(pw))           s++;
  if (/[0-9]/.test(pw))           s++;
  if (/[^A-Za-z0-9]/.test(pw))   s++;
  const score = Math.min(4, Math.floor((s / 6) * 5));
  const levels: StrengthLevel[]  = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = [
    "#ef4444", // red
    "#f97316", // orange
    "#eab308", // yellow
    "#22c55e", // green light
    "#16a34a", // green dark
  ];
  return { level: levels[score], score, color: colors[score] };
}

function generatePassword(
  length: number,
  opts: Record<CharOption, boolean>,
): string {
  let charset = "";
  const required: string[] = [];
  (Object.keys(opts) as CharOption[]).forEach((key) => {
    if (!opts[key]) return;
    charset += CHARS[key];
    required.push(CHARS[key][Math.floor(Math.random() * CHARS[key].length)]);
  });
  if (!charset) return "";

  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  const chars = Array.from(arr, (n) => charset[n % charset.length]);
  required.forEach((ch) => {
    chars[Math.floor(Math.random() * length)] = ch;
  });
  return chars.join("");
}

// ── Toggle row ──────────────────────────────────────────────────────────────
function ToggleOption({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <Row
      gap="12"
      vertical="center"
      horizontal="space-between"
      padding="12"
      radius="m"
      background={checked ? "brand-alpha-weak" : "neutral-alpha-weak"}
      border={checked ? "brand-alpha-medium" : "neutral-alpha-weak"}
      onClick={() => !disabled && onChange(!checked)}
      style={{ cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
    >
      <Text variant="body-default-s" onBackground={checked ? "brand-strong" : "neutral-medium"}>
        {label}
      </Text>
      <Row
        style={{ width: 20, height: 20, flexShrink: 0, borderRadius: 4,
          border: `1.5px solid ${checked ? "var(--brand-solid-strong)" : "var(--neutral-border-medium)"}`,
          background: checked ? "var(--brand-solid-strong)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {checked && <Icon name="check" size="xs" onBackground="neutral-strong" />}
      </Row>
    </Row>
  );
}

// ── Strength bar ─────────────────────────────────────────────────────────────
function StrengthBar({ password }: { password: string }) {
  const { level, score, color } = getStrength(password);
  return (
    <Row gap="8" vertical="center">
      <Row gap="4" style={{ flex: 1 }}>
        {Array.from({ length: 5 }, (_, i) => (
          <Row
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i <= score ? color : "var(--neutral-alpha-weak)",
              transition: "background 0.25s",
            }}
          />
        ))}
      </Row>
      <Text variant="label-default-xs" onBackground="neutral-weak" style={{ whiteSpace: "nowrap" }}>
        {level}
      </Text>
    </Row>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function PasswordGeneratorClient() {
  const [length, setLength] = useState(16);
  const [opts,   setOpts]   = useState<Record<CharOption, boolean>>({
    uppercase: true,
    lowercase: true,
    numbers:   true,
    symbols:   false,
  });
  const [passwords,    setPasswords]    = useState<string[]>([]);
  const [copiedIndex,  setCopiedIndex]  = useState<number | null>(null);

  const activeCount = Object.values(opts).filter(Boolean).length;

  const handleGenerate = useCallback(() => {
    setPasswords(Array.from({ length: 5 }, () => generatePassword(length, opts)));
  }, [length, opts]);

  const toggleOpt = (key: CharOption, val: boolean) => {
    const next = { ...opts, [key]: val };
    if (!Object.values(next).some(Boolean)) return; // keep at least one
    setOpts(next);
  };

  const handleCopy = async (pw: string, i: number) => {
    await navigator.clipboard.writeText(pw);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <Column maxWidth="m" gap="xl" paddingY="32">
      {/* Breadcrumb */}
      <Row gap="8" vertical="center">
        <Button href="/tools" variant="tertiary" size="s" prefixIcon="chevronLeft">Tools</Button>
        <Icon name="chevronRight" size="xs" onBackground="neutral-weak" />
        <Text variant="body-default-s" onBackground="neutral-weak">Password Generator</Text>
      </Row>

      {/* Header */}
      <Column gap="s">
        <Row gap="12" vertical="center">
          <Row padding="s" radius="m" background="brand-alpha-weak" horizontal="center" vertical="center">
            <Icon name="eyeOff" size="m" onBackground="brand-strong" />
          </Row>
          <Heading variant="display-strong-m">Password Generator</Heading>
        </Row>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Cryptographically secure passwords via the Web Crypto API — no server, no logs.
        </Text>
      </Column>

      {/* AdSense top */}
      <Row fillWidth padding="16" radius="m" border="neutral-alpha-weak" background="neutral-alpha-weak"
        horizontal="center" vertical="center" style={{ minHeight: "90px" }}>
        <Text variant="label-default-s" onBackground="neutral-weak">[ Advertisement ]</Text>
      </Row>

      <Row gap="xl" fillWidth wrap>
        {/* ── Settings ── */}
        <Column gap="l" style={{ flex: 1, minWidth: "260px" }}>
          <Column padding="l" radius="l" border="neutral-alpha-medium" background="surface" gap="l">
              <Heading as="h2" variant="heading-strong-m">Settings</Heading>

              {/* Slider */}
              <Column gap="s">
                <Row horizontal="space-between" vertical="center">
                  <Text variant="label-strong-s">Password Length</Text>
                  <Badge background="brand-alpha-weak" paddingX="12" paddingY="4" textVariant="label-strong-s">
                    {length}
                  </Badge>
                </Row>
                <input
                  type="range"
                  min={6} max={64}
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--brand-solid-strong)", cursor: "pointer" }}
                />
                <Row horizontal="space-between">
                  <Text variant="label-default-xs" onBackground="neutral-weak">6</Text>
                  <Text variant="label-default-xs" onBackground="neutral-weak">64</Text>
                </Row>
              </Column>

              {/* Char types */}
              <Column gap="s">
                <Text variant="label-strong-s">Character Types</Text>
                <ToggleOption label="Uppercase (A–Z)" checked={opts.uppercase}
                  onChange={(v) => toggleOpt("uppercase", v)} disabled={opts.uppercase && activeCount === 1} />
                <ToggleOption label="Lowercase (a–z)" checked={opts.lowercase}
                  onChange={(v) => toggleOpt("lowercase", v)} disabled={opts.lowercase && activeCount === 1} />
                <ToggleOption label="Numbers (0–9)"   checked={opts.numbers}
                  onChange={(v) => toggleOpt("numbers",   v)} disabled={opts.numbers   && activeCount === 1} />
                <ToggleOption label="Symbols (!@#$...)" checked={opts.symbols}
                  onChange={(v) => toggleOpt("symbols",   v)} disabled={opts.symbols   && activeCount === 1} />
              </Column>

              <Button variant="primary" size="l" onClick={handleGenerate} fillWidth prefixIcon="refresh">
                Generate Passwords
              </Button>
          </Column>
        </Column>

        {/* ── Results ── */}
        <Column gap="l" style={{ flex: "1.4", minWidth: "280px" }}>
          {passwords.length === 0 ? (
            <Column padding="xl" radius="l" border="neutral-alpha-medium" background="surface"
              horizontal="center" vertical="center" gap="m" style={{ minHeight: "200px" }}>
              <Icon name="eyeOff" size="xl" onBackground="neutral-weak" />
              <Text variant="body-default-m" onBackground="neutral-weak">
                Click "Generate Passwords" to get started
              </Text>
            </Column>
          ) : (
            <Column gap="m">
              <Heading as="h2" variant="heading-strong-m">Generated Passwords</Heading>
              {passwords.map((pw, i) => (
                <Column key={i} padding="m" radius="l" border="neutral-alpha-medium" background="surface" gap="s">
                  <Row gap="12" vertical="center" horizontal="space-between" wrap>
                    <Text
                      variant="body-default-m"
                      style={{ fontFamily: "var(--font-code, monospace)", wordBreak: "break-all",
                        flex: 1, letterSpacing: "0.04em" }}
                    >
                      {pw}
                    </Text>
                    <Button
                      variant="secondary"
                      size="s"
                      onClick={() => handleCopy(pw, i)}
                      prefixIcon="clipboard"
                      style={{ flexShrink: 0 }}
                    >
                      {copiedIndex === i ? "Copied!" : "Copy"}
                    </Button>
                  </Row>
                  <StrengthBar password={pw} />
                </Column>
              ))}
              <Button variant="tertiary" size="m" onClick={handleGenerate} fillWidth prefixIcon="refresh">
                Regenerate All
              </Button>
            </Column>
          )}

          {/* AdSense sidebar */}
          <Row fillWidth padding="16" radius="m" border="neutral-alpha-weak" background="neutral-alpha-weak"
            horizontal="center" vertical="center" style={{ minHeight: "250px" }}>
            <Text variant="label-default-s" onBackground="neutral-weak">[ Advertisement ]</Text>
          </Row>
        </Column>
      </Row>

      {/* SEO content */}
      <Column gap="m" paddingTop="16">
        <Heading as="h2" variant="heading-strong-m">About the Password Generator</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          This password generator uses <code>crypto.getRandomValues()</code> — the browser's
          cryptographically secure random number generator, the same API used by security software.
          Passwords are generated locally and never transmitted over the network.
        </Text>
        <Heading as="h3" variant="heading-strong-s">Security Tips</Heading>
        <Column gap="8">
          {[
            "Use at least 16 characters for accounts that store sensitive data.",
            "Enable symbols to significantly increase password entropy.",
            "Never reuse passwords across different services.",
            "Store generated passwords in a password manager (Bitwarden, 1Password, etc.).",
            "Enable two-factor authentication (2FA) wherever possible.",
          ].map((tip) => (
            <Row key={tip} gap="8" vertical="start">
              <Row style={{ paddingTop: "2px", flexShrink: 0 }}>
                <Icon name="checkCircle" size="s" onBackground="success-strong" />
              </Row>
              <Text variant="body-default-s" onBackground="neutral-weak">{tip}</Text>
            </Row>
          ))}
        </Column>
      </Column>
    </Column>
  );
}
