"use client";

import { useState, useCallback, useEffect } from "react";
import * as QRCode from "qrcode";
import {
  Column,
  Row,
  Heading,
  Text,
  Button,
  Input,
  Select,
  Icon,
} from "@/once-ui/components";

type QRType = "url" | "text" | "email" | "phone";

const QR_TYPES: { value: QRType; label: string; placeholder: string }[] = [
  { value: "url",   label: "URL / Link",      placeholder: "https://bidev.site" },
  { value: "text",  label: "Plain Text",       placeholder: "Enter any text..." },
  { value: "email", label: "Email Address",    placeholder: "hello@example.com" },
  { value: "phone", label: "Phone Number",     placeholder: "+1234567890" },
];

function buildContent(type: QRType, value: string): string {
  if (type === "email") return `mailto:${value}`;
  if (type === "phone") return `tel:${value}`;
  return value;
}

export default function QRGeneratorClient() {
  const [qrType, setQrType]         = useState<QRType>("url");
  const [inputValue, setInputValue] = useState("");
  const [qrDataURL, setQrDataURL]   = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [copied, setCopied]         = useState(false);

  const currentType = QR_TYPES.find((t) => t.value === qrType)!;

  const generateQR = useCallback(async (value: string, type: QRType) => {
    const trimmed = value.trim();
    if (!trimmed) {
      setQrDataURL(null);
      setError(null);
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const content = buildContent(type, trimmed);
      const dataURL = await QRCode.toDataURL(content, {
        width: 280,
        margin: 2,
        color: { dark: "#0a0a0a", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
      setQrDataURL(dataURL);
    } catch {
      setError("Failed to generate QR code. Try a shorter input.");
    } finally {
      setIsGenerating(false);
    }
  }, []);

  // Debounced auto-generate
  useEffect(() => {
    if (!inputValue.trim()) { setQrDataURL(null); setError(null); return; }
    const t = setTimeout(() => generateQR(inputValue, qrType), 500);
    return () => clearTimeout(t);
  }, [inputValue, qrType, generateQR]);

  const downloadQR = () => {
    if (!qrDataURL) return;
    const a = document.createElement("a");
    a.href = qrDataURL;
    a.download = "qr-bidev.png";
    a.click();
  };

  const copyQR = async () => {
    if (!qrDataURL) return;
    try {
      const res  = await fetch(qrDataURL);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    } catch {
      await navigator.clipboard.writeText(inputValue);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Column maxWidth="m" gap="xl" paddingY="32">
      {/* Breadcrumb */}
      <Row gap="8" vertical="center">
        <Button href="/tools" variant="tertiary" size="s" prefixIcon="chevronLeft">Tools</Button>
        <Icon name="chevronRight" size="xs" onBackground="neutral-weak" />
        <Text variant="body-default-s" onBackground="neutral-weak">QR Code Generator</Text>
      </Row>

      {/* Header */}
      <Column gap="s">
        <Row gap="12" vertical="center">
          <Row padding="s" radius="m" background="brand-alpha-weak" horizontal="center" vertical="center">
            <Icon name="tools" size="m" onBackground="brand-strong" />
          </Row>
          <Heading variant="display-strong-m">QR Code Generator</Heading>
        </Row>
        <Text variant="body-default-m" onBackground="neutral-weak">
          Generate QR codes instantly — everything runs in your browser.
        </Text>
      </Column>

      {/* AdSense top */}
      <Row fillWidth padding="16" radius="m" border="neutral-alpha-weak" background="neutral-alpha-weak"
        horizontal="center" vertical="center" style={{ minHeight: "90px" }}>
        <Text variant="label-default-s" onBackground="neutral-weak">[ Advertisement ]</Text>
      </Row>

      <Row gap="xl" fillWidth wrap>
        {/* ── Settings ── */}
        <Column gap="l" style={{ flex: "1", minWidth: "280px" }}>
          {/* Column instead of Card — Card always renders as <button>, nesting <button> inside is invalid */}
          <Column padding="l" radius="l" border="neutral-alpha-medium" background="surface" gap="l">
            <Heading as="h2" variant="heading-strong-m">Settings</Heading>

            <Select
              id="qr-type"
              label="QR Code Type"
              value={qrType}
              options={QR_TYPES.map((t) => ({ value: t.value, label: t.label }))}
              onSelect={(val) => {
                setQrType(val as QRType);
                setInputValue("");
                setQrDataURL(null);
              }}
            />

            <Input
              id="qr-input"
              label={currentType.label}
              placeholder={currentType.placeholder}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              error={!!error}
              errorMessage={error ?? undefined}
            />

            <Button
              variant="primary"
              size="m"
              onClick={() => generateQR(inputValue, qrType)}
              fillWidth
              loading={isGenerating}
              prefixIcon="refresh"
            >
              Generate QR Code
            </Button>
          </Column>

          <Column padding="l" radius="l" border="neutral-alpha-medium" background="surface" gap="m">
            <Heading as="h3" variant="heading-strong-s">How to use</Heading>
            {[
              "1. Select the type: URL, text, email, or phone.",
              "2. Type your content — QR updates automatically.",
              "3. Download PNG or copy to clipboard.",
              "4. Scan with any mobile QR reader.",
            ].map((s) => (
              <Text key={s} variant="body-default-s" onBackground="neutral-weak">{s}</Text>
            ))}
          </Column>
        </Column>

        {/* ── Preview ── */}
        <Column gap="l" style={{ flex: "1", minWidth: "280px" }}>
          <Column padding="l" radius="l" border="neutral-alpha-medium" background="surface" gap="l" horizontal="center">
            <Heading as="h2" variant="heading-strong-m">Preview</Heading>

            {qrDataURL ? (
              <Column gap="m" horizontal="center" fillWidth>
                <Row padding="16" radius="l" background="neutral-alpha-weak" border="neutral-alpha-weak"
                  horizontal="center" vertical="center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataURL} alt="Generated QR code" width={280} height={280}
                    style={{ display: "block", borderRadius: "4px" }} />
                </Row>
                <Row gap="12" fillWidth>
                  <Button variant="primary"   size="m" onClick={downloadQR} fillWidth prefixIcon="arrowUpRightFromSquare">
                    Download PNG
                  </Button>
                  <Button variant="secondary" size="m" onClick={copyQR}     fillWidth prefixIcon="clipboard">
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </Row>
              </Column>
            ) : (
              <Column horizontal="center" vertical="center" gap="m" style={{ minHeight: "280px" }}>
                <Icon name="tools" size="xl" onBackground="neutral-weak" />
                <Text variant="body-default-m" onBackground="neutral-weak">
                  Enter content above to generate a QR code
                </Text>
              </Column>
            )}
          </Column>

          {/* AdSense sidebar */}
          <Row fillWidth padding="16" radius="m" border="neutral-alpha-weak" background="neutral-alpha-weak"
            horizontal="center" vertical="center" style={{ minHeight: "250px" }}>
            <Text variant="label-default-s" onBackground="neutral-weak">[ Advertisement ]</Text>
          </Row>
        </Column>
      </Row>

      {/* SEO content */}
      <Column gap="m" paddingTop="16">
        <Heading as="h2" variant="heading-strong-m">About QR Code Generator</Heading>
        <Text variant="body-default-m" onBackground="neutral-weak">
          This free QR code generator creates QR codes for URLs, plain text, email addresses, and phone numbers
          directly in your browser. No server, no account, no data collection. Download as a PNG file and use
          anywhere — marketing materials, apps, presentations, or product packaging.
        </Text>
        <Text variant="body-default-m" onBackground="neutral-weak">
          QR codes are generated with Error Correction Level M, meaning they remain scannable even if up to 15%
          is damaged or obscured. For best results when printing, use a minimum size of 2 cm × 2 cm.
        </Text>
      </Column>
    </Column>
  );
}
