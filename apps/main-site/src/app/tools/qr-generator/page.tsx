import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { QRGenerator } from "@/components/tools/QRGenerator";

export const metadata: Metadata = pageMetadata({
  title: "QR Code Generator – Free Online Tool",
  description: "Generate QR codes for URLs, text, email, and phone numbers instantly. Download as PNG. Free, client-side, no sign-up.",
  path: "/tools/qr-generator",
});

export default function QRGeneratorPage() {
  return <QRGenerator />;
}
