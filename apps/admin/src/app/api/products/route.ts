import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, category } = body;

  if (!title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });
  if (!category) return NextResponse.json({ error: "Category is required" }, { status: 400 });
  if (!["flutter-starter-kit", "ui-kit", "ebook"].includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      ...body,
      slug: body.slug?.trim() || slugify(title),
      cover_url: body.cover_url || null,
      original_price: body.original_price ?? null,
      price_github: body.price_github ?? null,
      purchase_url_zip:    body.purchase_url_zip    || null,
      purchase_url_github: body.purchase_url_github || null,
      badge: body.badge || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
