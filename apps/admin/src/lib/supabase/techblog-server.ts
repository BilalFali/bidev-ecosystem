import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// BiDev Tech (tech.bidev.dev) lives in a SEPARATE Supabase project from the
// rest of this admin app. An admin user's session cookie is a JWT scoped to
// the main project only, so it carries no standing against the tech-blog
// project's RLS policies. Auth is still gated the normal way (middleware +
// the existing session check in every API route) — this client just talks
// to the other project directly with its service role key once that gate
// has already passed.
function requireEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required environment variable: ${name}`);
  return val;
}

export function createTechBlogClient() {
  return createSupabaseClient(
    requireEnv("TECHBLOG_SUPABASE_URL"),
    requireEnv("TECHBLOG_SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );
}
