import { createClient } from "@/lib/supabase-auth/server";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import type { AdminCategory, AdminSection, AdminTag } from "@/lib/admin/types";

export const metadata = { title: "New Article" };

export default async function NewArticlePage() {
  const supabase = await createClient();
  const [{ data: categories }, { data: sections }, { data: tags }] = await Promise.all([
    supabase.from("techblog_categories").select("*").order("sort_order"),
    supabase.from("techblog_sections").select("*").order("sort_order"),
    supabase.from("techblog_tags").select("*").order("name"),
  ]);

  return (
    <ArticleEditor
      categories={(categories ?? []) as AdminCategory[]}
      sections={(sections ?? []) as AdminSection[]}
      tags={(tags ?? []) as AdminTag[]}
    />
  );
}
