import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Eye, TrendingUp, FileText, BarChart2, Package, Wrench, Code2 } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Analytics" };
export const revalidate = 60;

type PageView = {
  id: string;
  page_type: string;
  page_slug: string;
  page_title: string;
  views: number;
  last_viewed_at: string;
};

const TYPE_LABELS: Record<string, string> = {
  article:  "Article",
  product:  "Product",
  tool:     "Tool",
  snippet:  "Snippet",
  page:     "Page",
};

const TYPE_COLORS: Record<string, string> = {
  article: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  product: "text-accent bg-accent/10 border-accent/20",
  tool:    "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  snippet: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  page:    "text-ink-muted bg-bg-elevated border-border",
};

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  article: FileText,
  product: Package,
  tool:    Wrench,
  snippet: Code2,
  page:    BarChart2,
};

async function getAnalytics() {
  try {
    const supabase = await createClient();

    const { data: pageViews } = await supabase
      .from("page_views")
      .select("*")
      .order("views", { ascending: false });

    const rows = (pageViews ?? []) as PageView[];
    const totalViews = rows.reduce((s, r) => s + r.views, 0);
    const uniquePages = rows.length;

    const byType: Record<string, PageView[]> = {};
    for (const row of rows) {
      if (!byType[row.page_type]) byType[row.page_type] = [];
      byType[row.page_type].push(row);
    }

    const topByType: Record<string, number> = {};
    for (const [type, items] of Object.entries(byType)) {
      topByType[type] = items.reduce((s, r) => s + r.views, 0);
    }

    return { rows, totalViews, uniquePages, byType, topByType };
  } catch {
    return { rows: [], totalViews: 0, uniquePages: 0, byType: {}, topByType: {} };
  }
}

function ViewRow({ row, rank, maxViews }: { row: PageView; rank: number; maxViews: number }) {
  const pct = maxViews > 0 ? (row.views / maxViews) * 100 : 0;
  const Icon = TYPE_ICONS[row.page_type] ?? BarChart2;
  const colorClass = TYPE_COLORS[row.page_type] ?? TYPE_COLORS.page;
  const label = TYPE_LABELS[row.page_type] ?? row.page_type;

  return (
    <div className="px-5 py-4 hover:bg-bg-card/40 transition-colors">
      <div className="flex items-center gap-4 mb-2">
        <span className="w-6 text-xs text-ink-faint text-center shrink-0">{rank}</span>
        <Icon className="w-3.5 h-3.5 text-ink-faint shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-ink truncate">
              {row.page_title || row.page_slug}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium shrink-0 ${colorClass}`}>
              {label}
            </span>
          </div>
          <p className="text-xs text-ink-faint mt-0.5">
            /{row.page_type === "article" ? "blog" : `${row.page_type}s`}/{row.page_slug} · last viewed {formatDate(row.last_viewed_at)}
          </p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Eye className="w-3.5 h-3.5 text-ink-faint" />
          <span className="text-sm font-semibold text-ink tabular-nums">
            {row.views.toLocaleString()}
          </span>
        </div>
      </div>
      <div className="ml-10 h-1 rounded-full bg-bg-card overflow-hidden">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default async function AnalyticsPage() {
  const { rows, totalViews, uniquePages, byType, topByType } = await getAnalytics();

  const topType = Object.entries(topByType).sort((a, b) => b[1] - a[1])[0];
  const maxViews = rows[0]?.views ?? 1;

  const typeOrder = ["article", "product", "tool", "snippet", "page"];
  const orderedTypes = [
    ...typeOrder.filter((t) => byType[t]),
    ...Object.keys(byType).filter((t) => !typeOrder.includes(t)),
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Analytics"
        description="Page views tracked across all content types"
      />

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Views"   value={totalViews}   icon={Eye}       accent />
        <StatsCard label="Pages Tracked" value={uniquePages}  icon={TrendingUp}       />
        <StatsCard label="Content Types" value={Object.keys(byType).length} icon={BarChart2} />
        <StatsCard label="Top Type"      value={topType ? TYPE_LABELS[topType[0]] ?? topType[0] : "—"} icon={TrendingUp} />
      </div>

      {/* Type breakdown */}
      {orderedTypes.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
          {orderedTypes.map((type) => {
            const items = byType[type] ?? [];
            const total = items.reduce((s, r) => s + r.views, 0);
            const Icon = TYPE_ICONS[type] ?? BarChart2;
            const colorClass = TYPE_COLORS[type] ?? TYPE_COLORS.page;
            return (
              <div key={type} className="bg-bg-elevated border border-border rounded-xl px-4 py-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-ink-faint" />
                  <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded border ${colorClass}`}>
                    {TYPE_LABELS[type] ?? type}
                  </span>
                </div>
                <p className="text-lg font-bold text-ink tabular-nums">{total.toLocaleString()}</p>
                <p className="text-[11px] text-ink-faint">{items.length} page{items.length !== 1 ? "s" : ""}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* All pages table */}
      <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink">All Pages by Views</h2>
          <span className="text-xs text-ink-faint">{rows.length} tracked</span>
        </div>

        {rows.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <Eye className="w-8 h-8 text-ink-faint mx-auto mb-3" />
            <p className="text-sm font-medium text-ink mb-1">No views tracked yet</p>
            <p className="text-xs text-ink-faint max-w-xs mx-auto">
              Views will appear here as readers visit your blog posts, product pages, tools, and snippets.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {rows.map((row, i) => (
              <ViewRow key={row.id} row={row} rank={i + 1} maxViews={maxViews} />
            ))}
          </div>
        )}
      </div>

      {/* Per-type sections */}
      {orderedTypes.length > 0 && rows.length > 0 && (
        <div className="mt-8 space-y-6">
          {orderedTypes.map((type) => {
            const items = byType[type] ?? [];
            const typeMax = items[0]?.views ?? 1;
            const Icon = TYPE_ICONS[type] ?? BarChart2;
            const colorClass = TYPE_COLORS[type] ?? TYPE_COLORS.page;
            return (
              <div key={type} className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-border flex items-center gap-2">
                  <Icon className="w-4 h-4 text-ink-faint" />
                  <h3 className="text-sm font-semibold text-ink">
                    {TYPE_LABELS[type] ?? type}s
                  </h3>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ml-1 ${colorClass}`}>
                    {items.length}
                  </span>
                </div>
                <div className="divide-y divide-border">
                  {items.slice(0, 10).map((row, i) => (
                    <ViewRow key={row.id} row={row} rank={i + 1} maxViews={typeMax} />
                  ))}
                  {items.length > 10 && (
                    <p className="px-5 py-3 text-xs text-ink-faint text-center">
                      +{items.length - 10} more — showing top 10
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-ink-faint text-center">
        Views counted once per session per visitor. Data refreshes every 60 seconds.
      </p>

      {/* Link to old article stats */}
      <div className="mt-4 text-center">
        <Link href="/articles" className="text-xs text-accent hover:underline">
          Manage articles →
        </Link>
      </div>
    </div>
  );
}
