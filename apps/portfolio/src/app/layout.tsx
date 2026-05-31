import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono  = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const SITE_URL  = "https://portfolio.bidev.site";
const NAME = "Bilal Fali – Flutter Developer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: NAME, template: "%s | Bilal Fali" },
  description: "Flutter Mobile App Developer from Algeria. 5+ years building cross-platform apps. 100K+ users served. Available for freelance.",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: NAME,
    locale: "en_US",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", creator: "@bidev97" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#050505", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <body className="bg-bg text-ink min-h-screen flex flex-col antialiased font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
