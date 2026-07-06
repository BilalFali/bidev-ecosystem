import { NextRequest, NextResponse } from "next/server";

// 301 permanent redirect from old domain to new domain.
// Handles exact URL preservation — /blog/flutter → /blog/flutter, not just homepage.
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") ?? "";

  if (host === "bidev.site" || host === "www.bidev.site") {
    const url = req.nextUrl.clone();
    url.host = "bidev.dev";
    url.port = "";
    return NextResponse.redirect(url, { status: 301 });
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static files
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:ico|png|svg|jpg|jpeg|gif|webp|woff2?|css|js)).*)",
  ],
};
