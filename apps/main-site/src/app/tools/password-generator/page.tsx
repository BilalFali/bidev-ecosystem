import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { TOOLS, resolveRelatedTools } from "@/lib/tools";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
import { ToolPageSeo } from "@/components/tools/ToolPageSeo";
import { RelatedTools } from "@/components/tools/RelatedTools";

const tool = TOOLS.find((t) => t.slug === "password-generator")!;

export const metadata: Metadata = pageMetadata({
  title: "Password Generator – Free Secure Password Tool",
  description: "Generate cryptographically secure random passwords using the Web Crypto API. Custom length, character sets, and strength indicator. Free.",
  path: "/tools/password-generator",
});

export default function Page() {
  return (
    <>
      <ToolPageSeo name={tool.title} description={tool.description} path={tool.href} />
      <PasswordGenerator />
      <RelatedTools tools={resolveRelatedTools("password-generator")} maxWidth="max-w-5xl" />
    </>
  );
}
