import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { UUIDGenerator } from "@/components/tools/UUIDGenerator";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";

const tool = TOOLS.find((t) => t.slug === "uuid-generator")!;

export const metadata: Metadata = pageMetadata({
  title: "UUID Generator – Free Online Tool",
  description: "Generate RFC-4122 compliant v4 UUIDs in bulk. Copy single or all UUIDs to clipboard. Free, client-side.",
  path: "/tools/uuid-generator",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <UUIDGenerator />
      <RelatedTools tools={resolveRelatedTools("uuid-generator")} />
    </>
  );
}
