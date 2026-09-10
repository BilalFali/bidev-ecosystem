"use client";

import { createBrowserClient } from "@supabase/ssr";

// Session-based (anon key + cookies) client for the admin login/UI —
// distinct from src/lib/supabase.ts, which is a service-role client used
// only for the public site's read-only content queries.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_TECHBLOG_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_TECHBLOG_SUPABASE_ANON_KEY!
  );
}
