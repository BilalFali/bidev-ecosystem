import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { QRGenerator } from "@/components/tools/QRGenerator";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";

const tool = TOOLS.find((t) => t.slug === "qr-generator")!;

export const metadata: Metadata = pageMetadata({
  title: "QR Code Generator – Free Online Tool",
  description: "Generate QR codes for URLs, text, email, and phone numbers instantly. Download as PNG. Free, client-side, no sign-up.",
  path: "/tools/qr-generator",
});

export default function QRGeneratorPage() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <QRGenerator />
      <RelatedTools tools={resolveRelatedTools("qr-generator")} maxWidth="max-w-5xl" />
    </>
  );
}
