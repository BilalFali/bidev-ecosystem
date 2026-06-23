import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { RegexTester } from "@/components/tools/RegexTester";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";

const tool = TOOLS.find((t) => t.slug === "regex-tester")!;

export const metadata: Metadata = pageMetadata({
  title: "Regex Tester – Free Online Tool",
  description: "Test regular expressions live against sample text with match highlighting, groups, and flags. Free, client-side.",
  path: "/tools/regex-tester",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <RegexTester />
      <RelatedTools tools={resolveRelatedTools("regex-tester")} maxWidth="max-w-5xl" />
    </>
  );
}
