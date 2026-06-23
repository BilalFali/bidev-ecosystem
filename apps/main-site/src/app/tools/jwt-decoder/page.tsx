import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { JWTDecoder } from "@/components/tools/JWTDecoder";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";

const tool = TOOLS.find((t) => t.slug === "jwt-decoder")!;

export const metadata: Metadata = pageMetadata({
  title: "JWT Decoder – Free Online Tool",
  description: "Decode JSON Web Tokens instantly. Inspect header, payload, algorithm, and expiry. Free, client-side — does not verify the signature.",
  path: "/tools/jwt-decoder",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <JWTDecoder />
      <RelatedTools tools={resolveRelatedTools("jwt-decoder")} maxWidth="max-w-5xl" />
    </>
  );
}
