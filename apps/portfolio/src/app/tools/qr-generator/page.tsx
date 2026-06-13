import type { Metadata } from "next";
import { baseURL } from "@/app/resources";
import { Meta } from "@/once-ui/modules";
import QRGeneratorClient from "./QRGeneratorClient";

export async function generateMetadata(): Promise<Metadata> {
  return Meta.generate({
    title: "QR Code Generator – Free Online Tool | bidev.site",
    description: "Generate QR codes instantly for URLs, text, email, phone, and more. Free, client-side, no sign-up required. Download as PNG.",
    baseURL: baseURL,
    image: `${baseURL}/og?title=QR+Code+Generator`,
    path: "/tools/qr-generator",
  });
}

export default function QRGeneratorPage() {
  return <QRGeneratorClient />;
}
