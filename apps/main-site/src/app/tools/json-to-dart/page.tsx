import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonToDart } from "@/components/tools/JsonToDart";

export const metadata: Metadata = pageMetadata({
  title: "JSON to Dart Converter – Free Online Flutter Tool",
  description: "Convert JSON to Dart model classes instantly. Generates fromJson, toJson, copyWith with null safety. Supports Equatable, json_serializable, and Freezed. Free Flutter tool.",
  path: "/tools/json-to-dart",
});

export default function Page() {
  return <JsonToDart />;
}
