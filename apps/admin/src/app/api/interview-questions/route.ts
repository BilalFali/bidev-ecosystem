import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { slugify } from "@/lib/utils";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("interview_questions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { question, category, short_answer, explanation } = body;

  if (!question?.trim())      return NextResponse.json({ error: "Question is required" }, { status: 400 });
  if (!category?.trim())      return NextResponse.json({ error: "Category is required" }, { status: 400 });
  if (!short_answer?.trim())  return NextResponse.json({ error: "Short answer is required" }, { status: 400 });
  if (!explanation?.trim())   return NextResponse.json({ error: "Explanation is required" }, { status: 400 });

  const { data, error } = await supabase
    .from("interview_questions")
    .insert({
      ...body,
      slug:                  body.slug?.trim() || slugify(question),
      code_language:         body.code_language || null,
      code_example:          body.code_example || null,
      common_mistakes:       body.common_mistakes ?? [],
      interview_tips:        body.interview_tips ?? [],
      related_slugs:         body.related_slugs ?? [],
      related_article_slugs: body.related_article_slugs ?? [],
      related_tool_slugs:    body.related_tool_slugs ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
