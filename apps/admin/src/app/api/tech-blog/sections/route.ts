import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createTechBlogClient } from "@/lib/supabase/techblog-server";

// Read-only: sections are a maintained taxonomy seeded by
// supabase-techblog/migrations/002_taxonomy.sql, not freely created by
// editors day to day (TAXONOMY.md §11 — a curated structure, not a
// freeform one). This just lists them for the article editor's cascading
// Category -> Section dropdown.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tb = createTechBlogClient();
  const { data, error } = await tb
    .from("techblog_sections")
    .select("*")
    .order("sort_order");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
