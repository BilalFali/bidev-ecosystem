import type { Metadata } from "next";
import { baseURL } from "@/app/resources";
import { Meta } from "@/once-ui/modules";
import JSONFormatterClient from "./JSONFormatterClient";

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: "JSON Formatter & Validator – Free Online Tool | bidev.site",
    description: "Format, validate, and minify JSON data online. Highlights syntax errors with line numbers. Free, client-side, no data sent to any server.",
    baseURL: baseURL,
    image: `${baseURL}/og?title=JSON+Formatter+%26+Validator`,
    path: "/tools/json-formatter",
  });
}

export default function JSONFormatterPage() {
  return <JSONFormatterClient />;
}
