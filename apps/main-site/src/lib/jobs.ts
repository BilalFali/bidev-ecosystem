import { getSupabaseClient } from "./supabase";

export interface Job {
  id: string;
  title: string;
  slug: string;
  company: string;
  company_logo_url: string | null;
  location: string | null;
  remote: "remote" | "hybrid" | "onsite";
  employment_type: "full-time" | "part-time" | "contract" | "internship";
  category: string;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  description: string;
  apply_url: string | null;
  apply_email: string | null;
  status: "draft" | "published" | "closed";
  posted_at: string | null;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function getAllJobs(): Promise<Job[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];

  const nowIso = new Date().toISOString();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("jobs")
    .select("*")
    .eq("status", "published")
    .or(`expires_at.is.null,expires_at.gt.${nowIso}`)
    .order("posted_at", { ascending: false });

  if (error) {
    console.error("getAllJobs error:", error);
    return [];
  }
  return (data ?? []) as Job[];
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any)
    .from("jobs")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error || !data) return null;
  return data as Job;
}
