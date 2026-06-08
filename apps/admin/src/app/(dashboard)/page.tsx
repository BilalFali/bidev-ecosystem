import Link from "next/link";
import { FileText, Image as ImageIcon, TrendingUp, Plus, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatsCard } from "@/components/ui/StatsCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import type { ArticleWithRelations } from "@/lib/types/database";

export const metadata = { title: "Overview" };

async function getStats() {
  try {
    const supabase = await createClient();

    const [
      { count: total },
      { count: published },
      { count: draft },
      { data: recentArticles },
      { count: mediaCount },
    ] = await Promise.all([
      supabase.from("articles").select("*", { count: "exact", head: true }),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "published"),
      supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
      supabase.from("articles_with_relations").select("*").order("updated_at", { ascending: false }).limit(6),
      supabase.from("media").select("*", { count: "exact", head: true }),
    ]);

    return {
      total:          total      ?? 0,
      published:      published  ?? 0,
      draft:          draft      ?? 0,
      media:          mediaCount ?? 0,
      recentArticles: (recentArticles ?? []) as ArticleWithRelations[],
    };
  } catch {
    return { total: 0, published: 0, draft: 0, media: 0, recentArticles: [] };
  }
}

export default async function OverviewPage() {
  const stats = await getStats();

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Overview"
        description="Your content at a glance"
        actions={
          <Link href="/articles/new">
            <Button size="sm"><Plus className="w-3.5 h-3.5" />New Article</Button>
          </Link>
        }
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Articles" value={stats.total}     icon={FileText}   />
        <StatsCard label="Published"      value={stats.published} icon={TrendingUp} accent />
        <StatsCard label="Drafts"         value={stats.draft}     icon={FileText}   />
        <StatsCard label="Media Files"    value={stats.media}     icon={ImageIcon}  />
      </div>

      {/* Recent articles */}
      <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-ink">Recent Articles</h2>
          <Link href="/articles" className="text-xs text-accent hover:text-accent-hover flex items-center gap-1 transition-colors">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {stats.recentArticles.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <FileText className="w-8 h-8 text-ink-faint mx-auto mb-3" />
            <p className="text-sm text-ink-muted">No articles yet.</p>
            <Link href="/articles/new" className="text-sm text-accent hover:underline mt-1 inline-block">
              Create your first article →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {stats.recentArticles.map(article => (
              <div key={article.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-bg-card/50 transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink truncate">{article.title}</p>
                  <p className="text-xs text-ink-muted mt-0.5">
                    {article.category_name && (
                      <span className="text-accent mr-2">{article.category_name}</span>
                    )}
                    Updated {formatDate(article.updated_at)}
                  </p>
                </div>
                <StatusBadge status={article.status} />
                <Link
                  href={`/articles/${article.id}/edit`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-ink-muted hover:text-ink flex items-center gap-1"
                >
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
