import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { JobForm } from "@/components/jobs/JobForm";

export default function NewJobPage() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader title="New Job" description="Create a new job listing" />
      <JobForm />
    </div>
  );
}
