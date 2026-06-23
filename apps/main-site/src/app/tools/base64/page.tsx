import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { Base64Tool } from "@/components/tools/Base64Tool";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";

const tool = TOOLS.find((t) => t.slug === "base64")!;

export const metadata: Metadata = pageMetadata({
  title: "Base64 Encoder & Decoder – Free Online Tool",
  description: "Encode text or URLs to Base64, or decode Base64 strings instantly. Supports UTF-8. Free, client-side, no data stored.",
  path: "/tools/base64",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <Base64Tool />
      <RelatedTools tools={resolveRelatedTools("base64")} maxWidth="max-w-5xl" />
    </>
  );
}
