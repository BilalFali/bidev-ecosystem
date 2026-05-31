import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { AdSlot } from "@bidev/ui";

export const metadata: Metadata = pageMetadata({
  title: "Free Developer Tools",
  description: "Free online tools for developers: QR code generator, JSON formatter, password generator, Base64 encoder, UUID generator, and more.",
  path: "/tools",
});

const TOOLS = [
  {
    href: "/tools/qr-generator",
    icon: "⬛",
    title: "QR Code Generator",
    description: "Generate QR codes for URLs, text, emails, and phone numbers instantly. Download as PNG.",
    tags: ["Generator", "Free"],
    popular: true,
  },
  {
    href: "/tools/json-formatter",
    icon: "{ }",
    title: "JSON Formatter & Validator",
    description: "Format, validate, and minify JSON. Real-time error detection with line numbers.",
    tags: ["Formatter", "Validator"],
    popular: true,
  },
  {
    href: "/tools/password-generator",
    icon: "🔐",
    title: "Password Generator",
    description: "Generate cryptographically secure passwords using the Web Crypto API. Strength indicator included.",
    tags: ["Security", "Generator"],
    popular: false,
  },
  {
    href: "/tools/base64",
    icon: "🔡",
    title: "Base64 Encoder / Decoder",
    description: "Encode any text or URL to Base64, or decode Base64 strings — fully client-side.",
    tags: ["Encoding", "Utility"],
    popular: false,
  },
  {
    href: "/tools/uuid-generator",
    icon: "🆔",
    title: "UUID Generator",
    description: "Generate RFC-4122 compliant v4 UUIDs in bulk. Copy to clipboard in one click.",
    tags: ["Generator", "Utility"],
    popular: false,
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">

      <div className="mb-12">
        <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">100% Free · Client-Side · No Sign-Up</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-ink mb-4">Developer Tools</h1>
        <p className="text-ink-muted max-w-xl">
          Fast, privacy-friendly tools that run entirely in your browser. No data is ever sent to a server.
        </p>
      </div>

      <AdSlot type="banner" className="mb-10" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group relative flex flex-col gap-4 p-6 rounded-xl border border-border bg-bg-card hover:border-accent/40 hover:bg-bg-elevated transition-all duration-200"
          >
            {tool.popular && (
              <span className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
                Popular
              </span>
            )}
            <span className="text-3xl">{tool.icon}</span>
            <div className="flex flex-col gap-2 flex-1">
              <h2 className="font-bold text-ink group-hover:text-accent transition-colors">{tool.title}</h2>
              <p className="text-sm text-ink-muted leading-relaxed">{tool.description}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5">
                {tool.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded bg-bg-elevated border border-border text-ink-faint">
                    {t}
                  </span>
                ))}
              </div>
              <span className="text-xs text-accent opacity-0 group-hover:opacity-100 transition-opacity">Open →</span>
            </div>
          </Link>
        ))}
      </div>

      <AdSlot type="in-article" className="mt-12" />

      <div className="mt-16 p-8 rounded-2xl border border-border bg-bg-card text-center">
        <h2 className="text-xl font-bold text-ink mb-2">More tools coming</h2>
        <p className="text-sm text-ink-muted mb-6">
          Suggest a tool you need — we build for the developer community.
        </p>
        <Link
          href="/contact"
          className="inline-flex px-6 py-2.5 rounded-lg bg-bg-elevated border border-border text-sm text-ink hover:border-border-strong transition-colors"
        >
          Suggest a Tool →
        </Link>
      </div>
    </div>
  );
}
