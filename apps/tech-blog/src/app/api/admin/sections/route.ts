import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-auth/server";

// Read-only: sections are a maintained taxonomy (TAXONOMY.md §11), not
// freely created by editors.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase.from("techblog_sections").select("*").order("sort_order");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
