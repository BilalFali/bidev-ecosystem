import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase-auth/server";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import type { AdminArticleWithRelations, AdminCategory, AdminSection, AdminTag } from "@/lib/admin/types";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const supabase = await createClient();
  const { id } = await params;
  const { data } = await supabase.from("techblog_articles").select("title").eq("id", id).single();
  return { title: data?.title ? `Edit: ${data.title}` : "Edit Article" };
}

export default async function EditArticlePage({ params }: Props) {
  const supabase = await createClient();
  const { id } = await params;

  const [{ data: article }, { data: categories }, { data: sections }, { data: tags }] = await Promise.all([
    supabase.from("techblog_articles_with_relations").select("*").eq("id", id).single(),
    supabase.from("techblog_categories").select("*").order("sort_order"),
    supabase.from("techblog_sections").select("*").order("sort_order"),
    supabase.from("techblog_tags").select("*").order("name"),
  ]);

  if (!article) notFound();

  return (
    <ArticleEditor
      article={article as AdminArticleWithRelations}
      categories={(categories ?? []) as AdminCategory[]}
      sections={(sections ?? []) as AdminSection[]}
      tags={(tags ?? []) as AdminTag[]}
    />
  );
}
