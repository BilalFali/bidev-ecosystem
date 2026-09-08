import { notFound } from "next/navigation";
import { createTechBlogClient } from "@/lib/supabase/techblog-server";
import { TechArticleEditor } from "@/components/tech-blog/TechArticleEditor";
import type { TechArticleWithRelations, TechCategory, TechSection, TechTag } from "@/lib/types/techblog-database";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const tb     = createTechBlogClient();
  const { id } = await params;
  const { data } = await tb.from("techblog_articles").select("title").eq("id", id).single();
  return { title: data?.title ? `Edit: ${data.title}` : "Edit Tech Blog Article" };
}

export default async function EditTechArticlePage({ params }: Props) {
  const tb     = createTechBlogClient();
  const { id } = await params;

  const [
    { data: article },
    { data: categories },
    { data: sections },
    { data: tags },
  ] = await Promise.all([
    tb.from("techblog_articles_with_relations").select("*").eq("id", id).single(),
    tb.from("techblog_categories").select("*").order("sort_order"),
    tb.from("techblog_sections").select("*").order("sort_order"),
    tb.from("techblog_tags").select("*").order("name"),
  ]);

  if (!article) notFound();

  return (
    <div className="-m-6 h-[calc(100vh-0px)] flex flex-col">
      <TechArticleEditor
        article={article as TechArticleWithRelations}
        categories={(categories ?? []) as TechCategory[]}
        sections={(sections ?? []) as TechSection[]}
        tags={(tags ?? []) as TechTag[]}
      />
    </div>
  );
}
