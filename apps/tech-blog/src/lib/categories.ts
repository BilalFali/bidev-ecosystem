import { getSupabaseClient } from "./supabase";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
}

// Dev-without-Supabase fallback so the app renders sensibly before the
// tech-blog Supabase project is provisioned/connected.
const FALLBACK_CATEGORIES: Category[] = [
  { id: "ai",        name: "AI",                    slug: "ai",        description: "AI news, tools, models, and the businesses building them.",  icon: "brain-circuit", sortOrder: 1 },
  { id: "mobile",    name: "Mobile",                slug: "mobile",    description: "Smartphones, wearables, and mobile OS.",                      icon: "smartphone",    sortOrder: 2 },
  { id: "hardware",  name: "Hardware",              slug: "hardware",  description: "Laptops, PCs, GPUs, CPUs, and the devices we use daily.",     icon: "cpu",            sortOrder: 3 },
  { id: "data",      name: "Data",                  slug: "data",      description: "Market data, statistics, and trackers.",                      icon: "bar-chart-3",   sortOrder: 4 },
  { id: "security",  name: "Security",              slug: "security",  description: "Cybersecurity and privacy.",                                  icon: "shield",         sortOrder: 5 },
  { id: "software",  name: "Software",              slug: "software",  description: "Apps, operating systems, the internet, and cloud computing.", icon: "layers",         sortOrder: 6 },
  { id: "bigtech",   name: "Big Tech",              slug: "bigtech",   description: "Apple, Google, Microsoft, Meta, NVIDIA, Amazon, and more.",   icon: "building-2",     sortOrder: 7 },
  { id: "business",  name: "Business",              slug: "business",  description: "Startups, funding, venture capital, and industry trends.",    icon: "briefcase",      sortOrder: 8 },
  { id: "gaming",    name: "Gaming",                slug: "gaming",    description: "Games, consoles, and the technology behind them.",            icon: "gamepad-2",      sortOrder: 9 },
  { id: "future-tech-science", name: "Future Tech & Science", slug: "future-tech-science", description: "Emerging science and the technology of tomorrow.", icon: "flask-conical", sortOrder: 10 },
];

interface DbRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return FALLBACK_CATEGORIES;

  const { data, error } = await supabase
    .from("techblog_categories")
    .select("id,name,slug,description,icon,sort_order")
    .eq("active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) return FALLBACK_CATEGORIES;

  return (data as DbRow[]).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    icon: c.icon,
    sortOrder: c.sort_order,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const all = await getAllCategories();
  return all.find((c) => c.slug === slug);
}
