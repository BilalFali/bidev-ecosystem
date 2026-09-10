import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}

// Session-based (anon key + cookies) server client for /admin pages and API
// routes. RLS on techblog_* tables allows writes when `auth.role() =
// 'authenticated'`, so admin writes go through THIS client, not the
// service-role one — the same convention apps/admin uses for its own
// content.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    requireEnv("NEXT_PUBLIC_TECHBLOG_SUPABASE_URL"),
    requireEnv("NEXT_PUBLIC_TECHBLOG_SUPABASE_ANON_KEY"),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Server Component — cookies can't be mutated here (expected)
          }
        },
      },
    }
  );
}
