import { createClient } from "@/lib/supabase/server";
import { ArticleEditor } from "@/components/articles/ArticleEditor";
import type { Category, Tag } from "@/lib/types/database";

export const metadata = { title: "New Article" };

export default async function NewArticlePage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: tags }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
  ]);

  return (
    <div className="-m-6 h-[calc(100vh-0px)] flex flex-col">
      <ArticleEditor
        categories={(categories ?? []) as Category[]}
        tags={(tags ?? []) as Tag[]}
      />
    </div>
  );
}
