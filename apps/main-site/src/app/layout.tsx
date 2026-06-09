import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WebVitals } from "@/components/analytics/WebVitals";
import { websiteJsonLd } from "@bidev/shared";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const GA_ID      = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const SITE_URL  = "https://bidev.site";
const SITE_NAME = "bidev.site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "bidev.site – Flutter, Mobile Dev & Developer Tools",
    template: "%s | bidev.site",
  },
  description:
    "Learn Flutter, build mobile apps, and explore free developer tools. In-depth tutorials, guides, and AI tools for developers.",
  keywords: ["Flutter", "mobile development", "developer tools", "Firebase", "Dart", "Next.js"],
  authors: [{ name: "Bilal Fali", url: SITE_URL }],
  creator: "Bilal Fali",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "bidev.site – Flutter, Mobile Dev & Developer Tools",
    description: "Learn Flutter, build mobile apps, and explore free developer tools.",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "bidev.site" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bidev97",
    creator: "@bidev97",
    title: "bidev.site – Flutter, Mobile Dev & Developer Tools",
    description: "Learn Flutter, build mobile apps, and explore free developer tools.",
    images: [`${SITE_URL}/og.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "94886a19b8b1ade5",
  },
  alternates: {
    canonical: SITE_URL,
    types: { "application/rss+xml": `${SITE_URL}/feed.xml` },
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = websiteJsonLd(SITE_URL, SITE_NAME, metadata.description as string);

  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to speed up external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {ADSENSE_ID && (
          <>
            <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
            <link rel="dns-prefetch" href="https://googleads.g.doubleclick.net" />
          </>
        )}
        {GA_ID && (
          <link rel="preconnect" href="https://www.googletagmanager.com" />
        )}

        {/* Structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>

      {/* AdSense Auto Ads */}
      {ADSENSE_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}

      <body className="bg-bg text-ink min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {GA_ID && <WebVitals />}
      </body>

      {/* Google Analytics 4 */}
      {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
    </html>
  );
}
