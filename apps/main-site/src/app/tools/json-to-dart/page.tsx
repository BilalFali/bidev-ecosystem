import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { JsonToDart } from "@/components/tools/JsonToDart";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";

const tool = TOOLS.find((t) => t.slug === "json-to-dart")!;

export const metadata: Metadata = pageMetadata({
  title: "JSON to Dart Converter – Free Online Flutter Tool",
  description: "Convert JSON to Dart model classes instantly. Generates fromJson, toJson, copyWith with null safety. Supports Equatable, json_serializable, and Freezed. Free Flutter tool.",
  path: "/tools/json-to-dart",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <JsonToDart />
      <RelatedTools tools={resolveRelatedTools("json-to-dart")} maxWidth="max-w-7xl" />
    </>
  );
}
