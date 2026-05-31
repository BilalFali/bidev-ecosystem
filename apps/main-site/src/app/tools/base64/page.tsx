import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { Base64Tool } from "@/components/tools/Base64Tool";
export const metadata: Metadata = pageMetadata({
  title: "Base64 Encoder & Decoder – Free Online Tool",
  description: "Encode text or URLs to Base64, or decode Base64 strings instantly. Supports UTF-8. Free, client-side, no data stored.",
  path: "/tools/base64",
});
export default function Page() { return <Base64Tool />; }
