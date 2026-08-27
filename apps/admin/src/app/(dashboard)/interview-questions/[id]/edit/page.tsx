import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { InterviewQuestionForm } from "@/components/interview-questions/InterviewQuestionForm";
import type { InterviewQuestion } from "@/lib/types/database";

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props) {
  const supabase = await createClient();
  const { id } = await params;
  const { data } = await supabase.from("interview_questions").select("question").eq("id", id).single();
  return { title: data?.question ? `Edit: ${data.question}` : "Edit Interview Question" };
}

export default async function EditInterviewQuestionPage({ params }: Props) {
  const supabase = await createClient();
  const { id } = await params;

  const { data: question } = await supabase.from("interview_questions").select("*").eq("id", id).single();
  if (!question) notFound();

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader title="Edit Interview Question" description={question.question} />
      <InterviewQuestionForm question={question as InterviewQuestion} />
    </div>
  );
}
