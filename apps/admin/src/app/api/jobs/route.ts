import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, company, apply_url, apply_email, status } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!company?.trim()) return NextResponse.json({ error: "Company is required" }, { status: 400 });
  if (!apply_url?.trim() && !apply_email?.trim()) {
    return NextResponse.json({ error: "Provide an apply URL or an apply email" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("jobs")
    .insert({
      ...body,
      slug: body.slug?.trim() || slugify(`${title}-${company}`),
      company_logo_url: body.company_logo_url || null,
      location: body.location || null,
      salary_min: body.salary_min ? Number(body.salary_min) : null,
      salary_max: body.salary_max ? Number(body.salary_max) : null,
      apply_url: apply_url || null,
      apply_email: apply_email || null,
      expires_at: body.expires_at || null,
      posted_at: status === "published" ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
