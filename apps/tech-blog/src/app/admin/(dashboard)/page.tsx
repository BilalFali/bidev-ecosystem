import Link from "next/link";
import { FileText, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase-auth/server";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Button } from "@/components/admin/Button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate } from "@/lib/utils";
import type { AdminArticleWithRelations } from "@/lib/admin/types";

export const metadata = { title: "Overview" };

async function getStats() {
  const supabase = await createClient();
  const [{ count: total }, { count: published }, { count: draft }, { data: recent }] = await Promise.all([
    supabase.from("techblog_articles").select("*", { count: "exact", head: true }),
    supabase.from("techblog_articles").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("techblog_articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase.from("techblog_articles_with_relations").select("*").order("updated_at", { ascending: false }).limit(8),
  ]);
  return {
    total: total ?? 0,
    published: published ?? 0,
    draft: draft ?? 0,
    recent: (recent ?? []) as AdminArticleWithRelations[],
  };
}

export default async function AdminOverviewPage() {
  const stats = await getStats();

  return (
    <div className="max-w-4xl mx-auto">
      <AdminHeader
        title="Overview"
        description="tech.bidev.dev at a glance"
        actions={<Link href="/admin/articles/new"><Button size="sm"><Plus className="w-3.5 h-3.5" />New Article</Button></Link>}
      />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="border border-border bg-paper-raised p-4">
          <div className="flex items-center gap-2 text-ink-muted mb-1"><FileText className="w-4 h-4" /><span className="text-xs">Total</span></div>
          <p className="text-2xl font-medium text-ink">{stats.total}</p>
        </div>
        <div className="border border-border bg-paper-raised p-4">
          <div className="flex items-center gap-2 text-accent mb-1"><TrendingUp className="w-4 h-4" /><span className="text-xs">Published</span></div>
          <p className="text-2xl font-medium text-ink">{stats.published}</p>
        </div>
        <div className="border border-border bg-paper-raised p-4">
          <div className="flex items-center gap-2 text-ink-muted mb-1"><FileText className="w-4 h-4" /><span className="text-xs">Drafts</span></div>
          <p className="text-2xl font-medium text-ink">{stats.draft}</p>
        </div>
      </div>

      <div className="border border-border bg-paper-raised">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-ink">Recent Articles</h2>
          <Link href="/admin/articles" className="text-xs text-accent hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        {stats.recent.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <FileText className="w-8 h-8 text-ink-faint mx-auto mb-3" />
            <p className="text-sm text-ink-muted">No articles yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {stats.recent.map(a => (
              <div key={a.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-paper-sunken transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{a.title}</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {a.category_name && <span className="text-accent mr-2">{a.category_name}</span>}
                    Updated {formatDate(a.updated_at)}
                  </p>
                </div>
                <StatusBadge status={a.status} />
                <Link href={`/admin/articles/${a.id}/edit`} className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-ink-muted hover:text-ink flex items-center gap-1">
                  Edit <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
