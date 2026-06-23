import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { DartDataClassGenerator } from "@/components/tools/DartDataClassGenerator";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";

const tool = TOOLS.find((t) => t.slug === "dart-data-class-generator")!;

export const metadata: Metadata = pageMetadata({
  title: "Dart Data Class Generator – Free Online Flutter Tool",
  description: "Paste JSON and generate an immutable Dart data class with copyWith, toString, and equality — no JSON serialization boilerplate. Free Flutter tool.",
  path: "/tools/dart-data-class-generator",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <DartDataClassGenerator />
      <RelatedTools tools={resolveRelatedTools("dart-data-class-generator")} maxWidth="max-w-5xl" />
    </>
  );
}
