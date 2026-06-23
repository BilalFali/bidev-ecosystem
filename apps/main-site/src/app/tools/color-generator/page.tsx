import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { ColorGenerator } from "@/components/tools/ColorGenerator";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";

const tool = TOOLS.find((t) => t.slug === "color-generator")!;

export const metadata: Metadata = pageMetadata({
  title: "Color Generator – Free Flutter ColorScheme Tool",
  description: "Pick a seed color, preview tints and shades, and copy a ready-to-use Flutter ColorScheme.fromSeed() snippet. Free, client-side.",
  path: "/tools/color-generator",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <ColorGenerator />
      <RelatedTools tools={resolveRelatedTools("color-generator")} />
    </>
  );
}
