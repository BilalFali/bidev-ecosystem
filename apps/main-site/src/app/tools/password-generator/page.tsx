import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { PasswordGenerator } from "@/components/tools/PasswordGenerator";
export const metadata: Metadata = pageMetadata({
  title: "Password Generator – Free Secure Password Tool",
  description: "Generate cryptographically secure random passwords using the Web Crypto API. Custom length, character sets, and strength indicator. Free.",
  path: "/tools/password-generator",
});
export default function Page() { return <PasswordGenerator />; }
