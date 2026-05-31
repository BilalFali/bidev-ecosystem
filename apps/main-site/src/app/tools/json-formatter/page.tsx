import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JSONFormatter } from "@/components/tools/JSONFormatter";
export const metadata: Metadata = pageMetadata({
  title: "JSON Formatter & Validator – Free Online Tool",
  description: "Format, validate, and minify JSON instantly. Real-time syntax error detection. Free, client-side, no data stored.",
  path: "/tools/json-formatter",
});
export default function Page() { return <JSONFormatter />; }
