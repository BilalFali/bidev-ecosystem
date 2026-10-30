import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output:          "standalone",
  eslint:         { ignoreDuringBuilds: true },
  typescript:     { ignoreBuildErrors: false },
  poweredByHeader: false,
  compress:        true,

  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "github.com" },
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },

  // Keep Supabase + heavy libs out of the client bundle
  serverExternalPackages: ["@supabase/supabase-js"],

  transpilePackages: ["@bidev/ui", "@bidev/shared"],

  redirects: async () => [
    {
      // Consolidated into the more comprehensive Provider/Riverpod/Bloc
      // comparison — was a redundant, narrower subset (fewer views, far
      // shorter) covering the same Riverpod-vs-Bloc ground.
      source: "/blog/riverpod-vs-bloc-2026",
      destination: "/blog/flutter-state-management-provider-vs-riverpod-vs-bloc",
      permanent: true,
    },
    {
      // Consolidated into the troubleshooting RenderFlex article — near-
      // duplicate content (same Expanded/Flexible/Wrap fixes, same framing),
      // and the troubleshooting format/structured fields serve the query better.
      source: "/blog/flutter-renderflex-overflow-every-real-cause",
      destination: "/blog/flutter-renderflex-overflowed-by-pixels",
      permanent: true,
    },
  ],

  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options",    value: "nosniff" },
        { key: "X-Frame-Options",           value: "DENY" },
        { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
      ],
    },
    {
      // Long cache for static assets (Next.js handles cache-busting via hashed filenames)
      source: "/_next/static/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/fonts/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
};

export default nextConfig;
