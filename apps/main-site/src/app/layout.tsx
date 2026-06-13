import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WebVitals } from "@/components/analytics/WebVitals";
import { websiteJsonLd, personJsonLd } from "@bidev/shared";

const ADSENSE_ID = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const GA_ID      = "G-C04YP7HRR0";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
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
  icons: {
    icon:        [{ url: "/profile.png", type: "image/png" }],
    apple:       [{ url: "/profile.png", type: "image/png" }],
    shortcut:    "/profile.png",
  },
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
  themeColor: "#101418",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd       = websiteJsonLd(SITE_URL, SITE_NAME, metadata.description as string);
  const personSchema = personJsonLd(SITE_URL);

  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`} suppressHydrationWarning>
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
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
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

      {/* Google Analytics 4 — exact tag from analytics.google.com */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </html>
  );
}
