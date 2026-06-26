"use client";

import { useState, useEffect } from "react";
import { Github, Copy, Check } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import { formatDate } from "@/lib/utils";
import type { GithubAccessRequest, GithubAccessStatus } from "@/lib/types/database";

const STATUS_VARIANT: Record<GithubAccessStatus, "warning" | "muted" | "success"> = {
  pending: "warning",
  invited: "muted",
  granted: "success",
};

export default function GithubAccessPage() {
  const [requests, setRequests] = useState<GithubAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { fetchRequests(); }, []);

  async function fetchRequests() {
    setLoading(true);
    const res = await fetch("/api/github-access");
    const data = await res.json();
    setRequests(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: GithubAccessStatus) {
    setActionId(id);
    const res = await fetch(`/api/github-access/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
    }
    setActionId(null);
  }

  async function copyUsername(username: string) {
    await navigator.clipboard.writeText(username);
    setCopied(username);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader
        title="GitHub Access"
        description={`${requests.filter((r) => r.status === "pending").length} pending`}
      />

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : requests.length === 0 ? (
        <div className="py-16 text-center">
          <Github className="w-8 h-8 text-ink-faint mx-auto mb-3" />
          <p className="text-sm text-ink-muted">No access requests yet.</p>
        </div>
      ) : (
        <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Product</th>
                <th className="text-left px-4 py-3 font-medium">GitHub</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-bg-card/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-ink">{req.customer_email}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-sm text-ink-muted line-clamp-1">{req.product_title}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-mono text-ink">@{req.github_username}</span>
                      <button
                        onClick={() => copyUsername(req.github_username)}
                        className="p-1 rounded hover:bg-bg-card text-ink-faint hover:text-ink transition-colors"
                        title="Copy username"
                      >
                        {copied === req.github_username
                          ? <Check className="w-3 h-3 text-accent" />
                          : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <Badge variant={STATUS_VARIANT[req.status]} dot>{req.status}</Badge>
                  </td>
                  <td className="px-4 py-3.5 hidden lg:table-cell">
                    <p className="text-xs text-ink-muted">{formatDate(req.created_at)}</p>
                    {req.granted_at && (
                      <p className="text-xs text-ink-faint">Granted: {formatDate(req.granted_at)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {req.status === "pending" && (
                        <button
                          onClick={() => updateStatus(req.id, "invited")}
                          disabled={actionId === req.id}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors disabled:opacity-50"
                        >
                          {actionId === req.id ? "…" : "Mark Invited"}
                        </button>
                      )}
                      {req.status === "invited" && (
                        <button
                          onClick={() => updateStatus(req.id, "granted")}
                          disabled={actionId === req.id}
                          className="text-xs px-2.5 py-1.5 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                        >
                          {actionId === req.id ? "…" : "Mark Granted"}
                        </button>
                      )}
                      {req.status === "granted" && (
                        <span className="text-xs text-ink-faint">✓ Done</span>
                      )}
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
