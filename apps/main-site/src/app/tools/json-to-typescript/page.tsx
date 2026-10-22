import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { JsonToTypeScript } from "@/components/tools/JsonToTypeScript";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolContent } from "@/components/tools/ToolContent";

const tool = TOOLS.find((t) => t.slug === "json-to-typescript")!;

export const metadata: Metadata = pageMetadata({
  title: "JSON to TypeScript Converter – Free Online Tool",
  description: "Convert JSON to TypeScript interfaces or type aliases instantly. Detects optional fields from null values. Free, runs entirely in your browser.",
  path: "/tools/json-to-typescript",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <JsonToTypeScript />
      <RelatedTools tools={resolveRelatedTools("json-to-typescript")} maxWidth="max-w-7xl" />
      <ToolContent slug="json-to-typescript" />
    </>
  );
}
