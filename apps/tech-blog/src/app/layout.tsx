import type { Metadata, Viewport } from "next";
import { Source_Serif_4, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// Source Serif 4 replaces Fraunces as the display face — Fraunces had become
// the default "distinctive editorial serif" reach across AI-generated design,
// which undercut the exact effect it was chosen for. Source Serif 4 gives
// the same editorial gravitas with a quieter, less-templated silhouette.
const displaySerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const SITE_URL  = "https://tech.bidev.dev";
const SITE_NAME = "BiDev Tech";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BiDev Tech — AI, Hardware & Technology News",
    template: "%s | BiDev Tech",
  },
  description:
    "A premium technology magazine covering AI, smartphones, hardware, big tech, cybersecurity, gaming, and the future of computing.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "BiDev Tech — AI, Hardware & Technology News",
    description: "A premium technology magazine covering AI, smartphones, hardware, big tech, cybersecurity, gaming, and the future of computing.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#F0F1EB",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${displaySerif.variable} ${plexSans.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className="bg-paper text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
