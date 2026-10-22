import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { ApiDiffChecker } from "@/components/tools/ApiDiffChecker";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolContent } from "@/components/tools/ToolContent";

const tool = TOOLS.find((t) => t.slug === "api-diff-checker")!;

export const metadata: Metadata = pageMetadata({
  title: "API Response Diff Checker – Free JSON Diff Tool",
  description: "Compare two JSON payloads and see exactly what was added, removed, or changed. Ignores key order, handles nested objects and arrays. Free, runs entirely in your browser.",
  path: "/tools/api-diff-checker",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <ApiDiffChecker />
      <RelatedTools tools={resolveRelatedTools("api-diff-checker")} maxWidth="max-w-7xl" />
      <ToolContent slug="api-diff-checker" />
    </>
  );
}
