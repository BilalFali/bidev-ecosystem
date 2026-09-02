import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WebVitals } from "@/components/analytics/WebVitals";
import { websiteJsonLd, personJsonLd, organizationJsonLd } from "@bidev/shared";

const ADSENSE_ID  = process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID;
const GA_ID       = "G-C04YP7HRR0";
const CLARITY_ID  = "xi6mxc4uzo";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "optional",  // no layout shift — falls back to system font if not cached
  preload: true,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "optional",
  preload: false,
});

const SITE_URL  = "https://bidev.dev";
const SITE_NAME = "BiDev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BiDev: Flutter, Dart & Firebase Tutorials for Developers",
    template: "%s | BiDev",
  },
  description:
    "Learn Flutter, Dart, and Firebase through in-depth tutorials, production-ready code examples, and free developer tools — written by Bilal Fali.",
  keywords: ["Flutter", "Dart", "Firebase", "mobile development", "developer tools", "Clean Architecture"],
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
    title: "BiDev: Flutter, Dart & Firebase Tutorials for Developers",
    description: "Learn Flutter, Dart, and Firebase through in-depth tutorials, production-ready code examples, and free developer tools — written by Bilal Fali.",
    images: [{ url: `${SITE_URL}/og.png`, width: 1200, height: 630, alt: "BiDev – Flutter & Dart Tutorials" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bidev97",
    creator: "@bidev97",
    title: "BiDev: Flutter, Dart & Firebase Tutorials for Developers",
    description: "Learn Flutter, Dart, and Firebase through in-depth tutorials, production-ready code examples, and free developer tools — written by Bilal Fali.",
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
  const orgSchema    = organizationJsonLd(SITE_URL);

  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* next/font self-hosts fonts — no external font connections needed */}
        {/* Only prefetch third-party origins we'll need after load */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        {ADSENSE_ID && (
          <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        )}

        {/* Structured data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </head>

      {/* Consent Mode v2 default — denies ad storage until the CMP below records a choice.
          analytics_storage is granted by default so GA4 isn't gated behind AdSense's
          consent flow; ad-related consent (for AdSense) is handled independently. */}
      {ADSENSE_ID && (
        <Script id="consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'analytics_storage': 'granted',
              'wait_for_update': 500
            });
          `}
        </Script>
      )}

      {/* Google-certified CMP (Funding Choices) — required for EEA/UK consent under AdSense policy */}
      {ADSENSE_ID && (
        <>
          <Script
            async
            src={`https://fundingchoicesmessages.google.com/i/${ADSENSE_ID}?ers=1`}
            strategy="beforeInteractive"
          />
          <Script id="googlefc-present" strategy="beforeInteractive">
            {`
              (function() {
                function signalGooglefcPresent() {
                  if (!window.frames['googlefcPresent']) {
                    if (document.body) {
                      const iframe = document.createElement('iframe');
                      iframe.style = 'width: 0; height: 0; border: none; z-index: -1000; left: -1000px; top: -1000px;';
                      iframe.style.display = 'none';
                      iframe.name = 'googlefcPresent';
                      document.body.appendChild(iframe);
                    } else {
                      setTimeout(signalGooglefcPresent, 0);
                    }
                  }
                }
                signalGooglefcPresent();
              })();
            `}
          </Script>
        </>
      )}

      {/* AdSense Auto Ads — lazyOnload so ads never block LCP/FID */}
      {ADSENSE_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}

      <body className="bg-bg text-ink min-h-screen flex flex-col antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {GA_ID && <WebVitals />}
        <Analytics />
      </body>

      {/* Google Analytics 4 */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="lazyOnload"
      />
      <Script id="gtag-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: true });
        `}
      </Script>

      {/* Microsoft Clarity */}
      <Script id="clarity-init" strategy="lazyOnload">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window,document,"clarity","script","${CLARITY_ID}");
        `}
      </Script>
    </html>
  );
}
