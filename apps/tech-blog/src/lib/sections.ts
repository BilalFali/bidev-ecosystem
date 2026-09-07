import { getSupabaseClient } from "./supabase";

export interface Section {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  sortOrder: number;
}

interface DbRow {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  sort_order: number;
}

// No fallback list here (unlike categories) — sections are meaningful only
// once the taxonomy migration has run against a real Supabase project.
export async function getSectionsByCategoryId(categoryId: string): Promise<Section[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("techblog_sections")
    .select("id,name,slug,category_id,sort_order")
    .eq("category_id", categoryId)
    .order("sort_order", { ascending: true });

  if (error || !data) return [];
  return (data as DbRow[]).map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    categoryId: s.category_id,
    sortOrder: s.sort_order,
  }));
}
