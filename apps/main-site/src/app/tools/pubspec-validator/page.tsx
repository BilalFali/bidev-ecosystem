import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { PubspecValidator } from "@/components/tools/PubspecValidator";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolContent } from "@/components/tools/ToolContent";

const tool = TOOLS.find((t) => t.slug === "pubspec-validator")!;

export const metadata: Metadata = pageMetadata({
  title: "pubspec.yaml Validator – Free Flutter Config Tool",
  description: "Validate pubspec.yaml syntax, catch malformed version constraints, and spot duplicate dependencies. Free, runs entirely in your browser.",
  path: "/tools/pubspec-validator",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <PubspecValidator />
      <RelatedTools tools={resolveRelatedTools("pubspec-validator")} maxWidth="max-w-7xl" />
      <ToolContent slug="pubspec-validator" />
    </>
  );
}
