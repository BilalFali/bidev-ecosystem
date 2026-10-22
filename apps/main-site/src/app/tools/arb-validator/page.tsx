import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { ArbValidator } from "@/components/tools/ArbValidator";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";
import { ToolContent } from "@/components/tools/ToolContent";

const tool = TOOLS.find((t) => t.slug === "arb-validator")!;

export const metadata: Metadata = pageMetadata({
  title: "ARB Localization Validator – Free Flutter i18n Tool",
  description: "Compare Flutter .arb localization files against a base locale. Find missing keys, extra keys, and mismatched ICU plural/select placeholders. Free, runs entirely in your browser.",
  path: "/tools/arb-validator",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <ArbValidator />
      <RelatedTools tools={resolveRelatedTools("arb-validator")} maxWidth="max-w-7xl" />
      <ToolContent slug="arb-validator" />
    </>
  );
}
