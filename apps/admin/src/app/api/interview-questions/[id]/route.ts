import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface Ctx { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data, error } = await supabase.from("interview_questions").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { question, category, short_answer, explanation } = body;

  if (!question?.trim())      return NextResponse.json({ error: "Question is required" }, { status: 400 });
  if (!category?.trim())      return NextResponse.json({ error: "Category is required" }, { status: 400 });
  if (!short_answer?.trim())  return NextResponse.json({ error: "Short answer is required" }, { status: 400 });
  if (!explanation?.trim())   return NextResponse.json({ error: "Explanation is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("interview_questions")
    .update({
      ...body,
      code_language:         body.code_language || null,
      code_example:          body.code_example || null,
      common_mistakes:       body.common_mistakes ?? [],
      interview_tips:        body.interview_tips ?? [],
      related_slugs:         body.related_slugs ?? [],
      related_article_slugs: body.related_article_slugs ?? [],
      related_tool_slugs:    body.related_tool_slugs ?? [],
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
  const { error } = await supabase.from("interview_questions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
