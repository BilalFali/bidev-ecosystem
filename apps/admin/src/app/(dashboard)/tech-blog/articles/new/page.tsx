import { createTechBlogClient } from "@/lib/supabase/techblog-server";
import { TechArticleEditor } from "@/components/tech-blog/TechArticleEditor";
import type { TechCategory, TechSection, TechTag } from "@/lib/types/techblog-database";

export const metadata = { title: "New Tech Blog Article" };

export default async function NewTechArticlePage() {
  const tb = createTechBlogClient();

  const [{ data: categories }, { data: sections }, { data: tags }] = await Promise.all([
    tb.from("techblog_categories").select("*").order("sort_order"),
    tb.from("techblog_sections").select("*").order("sort_order"),
    tb.from("techblog_tags").select("*").order("name"),
  ]);

  return (
    <div className="-m-6 h-[calc(100vh-0px)] flex flex-col">
      <TechArticleEditor
        categories={(categories ?? []) as TechCategory[]}
        sections={(sections ?? []) as TechSection[]}
        tags={(tags ?? []) as TechTag[]}
      />
    </div>
  );
}
