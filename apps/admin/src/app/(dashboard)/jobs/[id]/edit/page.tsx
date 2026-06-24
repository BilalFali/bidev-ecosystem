import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { JobForm } from "@/components/jobs/JobForm";
import type { Job } from "@/lib/types/database";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const supabase = await createClient();
  const { id } = await params;
  const { data } = await supabase.from("jobs").select("title").eq("id", id).single();
  return { title: data?.title ? `Edit: ${data.title}` : "Edit Job" };
}

export default async function EditJobPage({ params }: Props) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: job } = await supabase.from("jobs").select("*").eq("id", id).single();
  if (!job) notFound();

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader title="Edit Job" description={job.title} />
      <JobForm job={job as Job} />
    </div>
  );
}
