"use client";

import { useState, useCallback, useEffect } from "react";
import * as QRCode from "qrcode";
import { QrCode } from "lucide-react";
import { AdSlot } from "@bidev/ui";

type QRType = "url" | "text" | "email" | "phone";

const TYPES = [
  { value: "url"   as QRType, label: "URL",   placeholder: "https://bidev.dev" },
  { value: "text"  as QRType, label: "Text",  placeholder: "Enter any text…" },
  { value: "email" as QRType, label: "Email", placeholder: "hello@example.com" },
  { value: "phone" as QRType, label: "Phone", placeholder: "+1 234 567 8900" },
];

function buildContent(type: QRType, val: string) {
  if (type === "email") return `mailto:${val}`;
  if (type === "phone") return `tel:${val}`;
  return val;
}

export function QRGenerator() {
  const [type,      setType]      = useState<QRType>("url");
  const [input,     setInput]     = useState("");
  const [dataURL,   setDataURL]   = useState<string | null>(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);
  const [copied,    setCopied]    = useState(false);
  const current = TYPES.find((t) => t.value === type)!;

  const generate = useCallback(async (val: string, t: QRType) => {
    if (!val.trim()) { setDataURL(null); setError(null); return; }
    setLoading(true); setError(null);
    try {
      const url = await QRCode.toDataURL(buildContent(t, val.trim()), {
        width: 300, margin: 2,
        color: { dark: "#0a0a0a", light: "#ffffff" },
        errorCorrectionLevel: "M",
      });
      setDataURL(url);
    } catch { setError("Failed to generate — try a shorter input."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!input.trim()) { setDataURL(null); return; }
    const t = setTimeout(() => generate(input, type), 500);
    return () => clearTimeout(t);
  }, [input, type, generate]);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-14">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-xs text-ink-faint mb-5">
          <a href="/tools" className="hover:text-ink-muted transition-colors">Tools</a> / QR Code Generator
        </nav>
        <h1 className="text-3xl font-bold text-ink mb-2">QR Code Generator</h1>
        <p className="text-ink-muted">Generate QR codes instantly — fully client-side, no data stored.</p>
      </div>

      <AdSlot type="banner" className="mb-8" />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="flex flex-col gap-5">
          {/* Type tabs */}
          <div className="flex gap-1 p-1 bg-bg-card border border-border rounded-lg">
            {TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => { setType(t.value); setInput(""); setDataURL(null); }}
                className={`flex-1 py-2 rounded-md text-xs font-medium transition-colors ${
                  type === t.value ? "bg-accent text-bg" : "text-ink-muted hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-ink">{current.label}</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={current.placeholder}
              className={`w-full px-4 py-3 rounded-lg bg-bg-card border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors text-sm ${
                error ? "border-red-500/60" : "border-border"
              }`}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
          </div>

          <button
            onClick={() => generate(input, type)}
            disabled={loading || !input.trim()}
            className="w-full py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Generating…" : "Generate QR Code"}
          </button>

          {/* How to use */}
          <div className="p-5 rounded-xl border border-border bg-bg-card">
            <h3 className="text-sm font-semibold text-ink mb-3">How to use</h3>
            <ol className="flex flex-col gap-2 text-sm text-ink-muted list-decimal list-inside">
              <li>Select QR code type (URL, text, email, phone)</li>
              <li>Enter your content — QR updates automatically</li>
              <li>Download PNG or copy to clipboard</li>
              <li>Scan with any mobile QR reader</li>
            </ol>
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-4">
          <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 rounded-xl border border-border bg-bg-card min-h-[340px]">
            {dataURL ? (
              <>
                <img src={dataURL} alt="Generated QR code" width={280} height={280} className="rounded-lg" />
                <div className="flex gap-3 w-full">
                  <a
                    href={dataURL}
                    download="qr-bidev.png"
                    className="flex-1 py-2.5 rounded-lg bg-accent text-bg text-sm font-semibold text-center hover:bg-accent-hover transition-colors"
                  >
                    Download PNG
                  </a>
                  <button
                    onClick={async () => {
                      const res = await fetch(dataURL); const blob = await res.blob();
                      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]).catch(() => navigator.clipboard.writeText(input));
                      setCopied(true); setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex-1 py-2.5 rounded-lg border border-border bg-bg-elevated text-sm text-ink hover:border-border-strong transition-colors"
                  >
                    {copied ? "Copied!" : "Copy Image"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <QrCode className="w-12 h-12 mb-4 opacity-20" strokeWidth={1.5} />
                <p className="text-sm text-ink-faint">Enter content above to generate</p>
              </div>
            )}
          </div>
          <AdSlot type="sidebar" />
        </div>
      </div>

      {/* SEO blurb */}
      <div className="mt-12 prose prose-invert max-w-none">
        <h2>About this QR Code Generator</h2>
        <p>
          This free QR code generator creates QR codes for URLs, plain text, email addresses, and
          phone numbers entirely in your browser using the <code>qrcode</code> library. No data is
          sent to any server. Generated codes use Error Correction Level M — scannable even if up to
          15% of the code is damaged.
        </p>
      </div>
    </div>
  );
}
