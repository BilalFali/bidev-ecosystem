import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { DartEnumGenerator } from "@/components/tools/DartEnumGenerator";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolContent } from "@/components/tools/ToolContent";

const tool = TOOLS.find((t) => t.slug === "dart-enum-generator")!;

export const metadata: Metadata = pageMetadata({
  title: "Dart Enum Generator – Free Flutter Tool",
  description: "Generate a Dart 3 enhanced enum from a list of values, with optional fromString and toJson helpers. Free, runs entirely in your browser.",
  path: "/tools/dart-enum-generator",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <DartEnumGenerator />
      <RelatedTools tools={resolveRelatedTools("dart-enum-generator")} maxWidth="max-w-7xl" />
      <ToolContent slug="dart-enum-generator" />
    </>
  );
}
