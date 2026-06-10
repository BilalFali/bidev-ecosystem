import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Eye, TrendingUp, FileText, BarChart2 } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Analytics" };
export const revalidate = 60;

async function getAnalytics() {
  try {
    const supabase = await createClient();

    const { data: articles } = await supabase
      .from("articles")
      .select("id, title, slug, status, views, published_at, updated_at")
      .order("views", { ascending: false });

    const all       = articles ?? [];
    const published = all.filter(a => a.status === "published");
    const totalViews = all.reduce((sum, a) => sum + (a.views ?? 0), 0);
    const maxViews   = published[0]?.views ?? 1;

    return { all, published, totalViews, maxViews };
  } catch {
    return { all: [], published: [], totalViews: 0, maxViews: 1 };
  }
}

export default async function AnalyticsPage() {
  const { all, published, totalViews, maxViews } = await getAnalytics();

  const avgViews = published.length
    ? Math.round(totalViews / published.length)
    : 0;

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Analytics"
        description="Article views tracked from your blog"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Views"      value={totalViews}        icon={Eye}       accent />
        <StatsCard label="Published"        value={published.length}  icon={TrendingUp}       />
        <StatsCard label="Avg Views"        value={avgViews}          icon={BarChart2}        />
        <StatsCard label="Total Articles"   value={all.length}        icon={FileText}         />
      </div>

      {/* Top articles */}
      <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-ink">Articles by Views</h2>
        </div>

        {published.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-ink-muted">
            No published articles yet — views will appear here as readers visit your blog.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {published.map((article, i) => {
              const pct = maxViews > 0 ? ((article.views ?? 0) / maxViews) * 100 : 0;
              return (
                <div key={article.id} className="px-5 py-4 hover:bg-bg-card/40 transition-colors">
                  <div className="flex items-center gap-4 mb-2">
                    {/* Rank */}
                    <span className="w-6 text-xs text-ink-faint text-center shrink-0">
                      {i + 1}
                    </span>

                    {/* Title */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/articles/${article.id}/edit`}
                        className="text-sm font-medium text-ink hover:text-accent transition-colors truncate block"
                      >
                        {article.title}
                      </Link>
                      <p className="text-xs text-ink-faint mt-0.5">
                        {article.published_at ? formatDate(article.published_at) : "—"}
                      </p>
                    </div>

                    {/* Views */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Eye className="w-3.5 h-3.5 text-ink-faint" />
                      <span className="text-sm font-semibold text-ink tabular-nums">
                        {(article.views ?? 0).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* View bar */}
                  <div className="ml-10 h-1 rounded-full bg-bg-card overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note */}
      <p className="mt-4 text-xs text-ink-faint text-center">
        Views are counted once per session per reader.
        Data updates every 60 seconds.
      </p>
    </div>
  );
}
