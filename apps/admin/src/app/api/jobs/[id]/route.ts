import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Ctx { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase.from("jobs").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { apply_url, apply_email, status } = body;

  if (!apply_url?.trim() && !apply_email?.trim()) {
    return NextResponse.json({ error: "Provide an apply URL or an apply email" }, { status: 400 });
  }

  const { data: existing } = await supabase.from("jobs").select("posted_at").eq("id", id).single();

  const { data, error } = await supabase
    .from("jobs")
    .update({
      ...body,
      company_logo_url: body.company_logo_url || null,
      location: body.location || null,
      salary_min: body.salary_min ? Number(body.salary_min) : null,
      salary_max: body.salary_max ? Number(body.salary_max) : null,
      apply_url: apply_url || null,
      apply_email: apply_email || null,
      expires_at: body.expires_at || null,
      posted_at: status === "published" ? (existing?.posted_at ?? new Date().toISOString()) : existing?.posted_at ?? null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase.from("jobs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
