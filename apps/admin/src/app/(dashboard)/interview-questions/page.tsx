"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, HelpCircle, Pencil } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import type { InterviewQuestion, InterviewQuestionStatus } from "@/lib/types/database";

const STATUS_VARIANT: Record<InterviewQuestionStatus, "success" | "warning"> = {
  published: "success",
  draft: "warning",
};

export default function InterviewQuestionsPage() {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => { fetchQuestions(); }, []);

  async function fetchQuestions() {
    setLoading(true);
    const res = await fetch("/api/interview-questions");
    const data = await res.json();
    setQuestions(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this interview question?")) return;
    await fetch(`/api/interview-questions/${id}`, { method: "DELETE" });
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  const filtered = search.trim()
    ? questions.filter((q) => q.question.toLowerCase().includes(search.trim().toLowerCase()))
    : questions;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Interview Questions"
        description={`${questions.length} question${questions.length !== 1 ? "s" : ""}`}
        actions={
          <Link href="/interview-questions/new">
            <Button size="sm"><Plus className="w-3.5 h-3.5" />New Question</Button>
          </Link>
        }
      />

      {questions.length > 0 && (
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search questions…"
          className="w-full mb-4 px-3 py-2 rounded-lg bg-bg-elevated border border-border text-sm text-ink placeholder:text-ink-faint outline-none focus:border-accent transition-colors"
        />
      )}

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center">
          <HelpCircle className="w-8 h-8 text-ink-faint mx-auto mb-3" />
          <p className="text-sm text-ink-muted">
            {questions.length === 0 ? "No interview questions yet." : "No questions match your search."}
          </p>
        </div>
      ) : (
        <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Question</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium">Difficulty</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-bg-card/50 transition-colors group">
                  <td className="px-5 py-3.5 max-w-sm">
                    <p className="text-sm font-medium text-ink line-clamp-1">{q.question}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-ink-muted">{q.category}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs text-ink-muted">{q.difficulty}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={STATUS_VARIANT[q.status]} dot>{q.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-ink-muted">{formatDate(q.updated_at)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/interview-questions/${q.id}/edit`}
                        className="p-1.5 rounded-md hover:bg-bg-card text-ink-muted hover:text-accent"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(q.id)}
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
