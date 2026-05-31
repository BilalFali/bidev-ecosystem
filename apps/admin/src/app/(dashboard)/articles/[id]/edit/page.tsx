import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ArticleEditor } from "@/components/articles/ArticleEditor";
import type { ArticleWithRelations, Category, Tag } from "@/lib/types/database";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const supabase = await createClient();
  const { id }   = await params;
  const { data } = await supabase.from("articles").select("title").eq("id", id).single();
  return { title: data?.title ? `Edit: ${data.title}` : "Edit Article" };
}

export default async function EditArticlePage({ params }: Props) {
  const supabase = await createClient();
  const { id }   = await params;

  const [
    { data: article },
    { data: categories },
    { data: tags },
  ] = await Promise.all([
    supabase.from("articles_with_relations").select("*").eq("id", id).single(),
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
  ]);

  if (!article) notFound();

  return (
    <div className="-m-6 h-[calc(100vh-0px)] flex flex-col">
      <ArticleEditor
        article={article as ArticleWithRelations}
        categories={(categories ?? []) as Category[]}
        tags={(tags ?? []) as Tag[]}
      />
    </div>
  );
}
