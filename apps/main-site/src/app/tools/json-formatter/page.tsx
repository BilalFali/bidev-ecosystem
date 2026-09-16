import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { JSONFormatter } from "@/components/tools/JSONFormatter";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolContent } from "@/components/tools/ToolContent";

const tool = TOOLS.find((t) => t.slug === "json-formatter")!;

export const metadata: Metadata = pageMetadata({
  title: "JSON Formatter & Validator – Free Online Tool",
  description: "Format, validate, and minify JSON instantly. Real-time syntax error detection. Free, client-side, no data stored.",
  path: "/tools/json-formatter",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <JSONFormatter />
      <RelatedTools tools={resolveRelatedTools("json-formatter")} maxWidth="max-w-7xl" />
      <ToolContent slug="json-formatter" />
    </>
  );
}
