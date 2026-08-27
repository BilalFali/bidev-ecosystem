import { createClient } from "@/lib/supabase/server";
import { ArticleEditor } from "@/components/articles/ArticleEditor";
import type { Category, Tag, TroubleshootingCategory } from "@/lib/types/database";

export const metadata = { title: "New Article" };

export default async function NewArticlePage({
  searchParams,
}: {
  searchParams: Promise<{ troubleshooting?: string }>;
}) {
  const supabase = await createClient();
  const { troubleshooting } = await searchParams;

  const [{ data: categories }, { data: tags }, { data: troubleshootingCategories }] = await Promise.all([
    supabase.from("categories").select("*").order("name"),
    supabase.from("tags").select("*").order("name"),
    supabase.from("troubleshooting_categories").select("*").order("sort_order"),
  ]);

  return (
    <div className="-m-6 h-[calc(100vh-0px)] flex flex-col">
      <ArticleEditor
        categories={(categories ?? []) as Category[]}
        tags={(tags ?? []) as Tag[]}
        troubleshootingCategories={(troubleshootingCategories ?? []) as TroubleshootingCategory[]}
        defaultTroubleshooting={troubleshooting === "1"}
      />
    </div>
  );
}
