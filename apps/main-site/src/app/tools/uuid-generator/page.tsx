import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { UUIDGenerator } from "@/components/tools/UUIDGenerator";
export const metadata: Metadata = pageMetadata({
  title: "UUID Generator – Free Online Tool",
  description: "Generate RFC-4122 compliant v4 UUIDs in bulk. Copy single or all UUIDs to clipboard. Free, client-side.",
  path: "/tools/uuid-generator",
});
export default function Page() { return <UUIDGenerator />; }
