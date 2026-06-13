import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a dummy client if env vars are missing (for development/production without Supabase)
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: false,
        },
        global: {
          fetch: (url, options = {}) => {
            return fetch(url, {
              ...options,
              cache: "no-store",
            });
          },
        },
      })
    : null;

export const isSupabaseConfigured = () => supabase !== null;
