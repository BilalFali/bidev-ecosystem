"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Briefcase, Pencil } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import type { Job, JobStatus } from "@/lib/types/database";

const STATUS_VARIANT: Record<JobStatus, "success" | "warning" | "muted"> = {
  published: "success",
  draft: "warning",
  closed: "muted",
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchJobs(); }, []);

  async function fetchJobs() {
    setLoading(true);
    const res = await fetch("/api/jobs");
    const data = await res.json();
    setJobs(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this job listing?")) return;
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Jobs"
        description={`${jobs.length} job${jobs.length !== 1 ? "s" : ""}`}
        actions={
          <Link href="/jobs/new">
            <Button size="sm"><Plus className="w-3.5 h-3.5" />New Job</Button>
          </Link>
        }
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : jobs.length === 0 ? (
        <div className="py-16 text-center">
          <Briefcase className="w-8 h-8 text-ink-faint mx-auto mb-3" />
          <p className="text-sm text-ink-muted">No job listings yet.</p>
        </div>
      ) : (
        <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Company</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Posted</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-bg-card/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-ink">{job.title}</p>
                    <p className="text-xs text-ink-muted mt-0.5">{job.employment_type} · {job.remote}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-ink-muted">{job.company}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={STATUS_VARIANT[job.status]} dot>{job.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-ink-muted">
                      {job.posted_at ? formatDate(job.posted_at) : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/jobs/${job.id}/edit`}
                        className="p-1.5 rounded-md hover:bg-bg-card text-ink-muted hover:text-accent"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/10 text-ink-muted hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
