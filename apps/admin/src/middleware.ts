import { NextResponse, type NextRequest } from "next/server";
import { getAccessIdentityFromHeaders } from "@/lib/cloudflare-access";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?)$/)
  ) {
    return NextResponse.next();
  }

  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const identity = getAccessIdentityFromHeaders(request.headers);
  if (!identity && !pathname.startsWith("/cdn-cgi/access")) {
    return NextResponse.rewrite(new URL("/cloudflare-access-required", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
