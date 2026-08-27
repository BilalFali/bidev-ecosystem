import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { InterviewQuestionForm } from "@/components/interview-questions/InterviewQuestionForm";

export default function NewInterviewQuestionPage() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader title="New Interview Question" description="Add a new Flutter interview question" />
      <InterviewQuestionForm />
    </div>
  );
}
