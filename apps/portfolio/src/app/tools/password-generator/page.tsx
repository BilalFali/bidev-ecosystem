import type { Metadata } from "next";
import { baseURL } from "@/app/resources";
import { Meta } from "@/once-ui/modules";
import PasswordGeneratorClient from "./PasswordGeneratorClient";

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: "Password Generator – Free Secure Password Tool | bidev.dev",
    description: "Generate strong, secure random passwords with custom length and character sets. Includes password strength indicator. Free, client-side, no data sent to any server.",
    baseURL: baseURL,
    image: `${baseURL}/og?title=Password+Generator`,
    path: "/tools/password-generator",
  });
}

export default function PasswordGeneratorPage() {
  return <PasswordGeneratorClient />;
}
