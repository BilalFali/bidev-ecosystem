import Link from "next/link";
import { Plus, Search, Pencil, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate, truncate } from "@/lib/utils";
import type { ArticleWithRelations } from "@/lib/types/database";

export const metadata = { title: "Articles" };

interface SearchParams { status?: string; search?: string }

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const supabase = await createClient();
  const params   = await searchParams;

  let query = supabase
    .from("articles_with_relations")
    .select("*")
    .order("updated_at", { ascending: false });

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status);
  }
  if (params.search) {
    query = query.ilike("title", `%${params.search}%`);
  }

  const { data: articles } = await query;
  const list = (articles ?? []) as ArticleWithRelations[];

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Articles"
        description={`${list.length} article${list.length !== 1 ? "s" : ""}`}
        actions={
          <Link href="/articles/new">
            <Button size="sm"><Plus className="w-3.5 h-3.5" />New Article</Button>
          </Link>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <form className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
          <input
            name="search"
            defaultValue={params.search}
            placeholder="Search articles…"
            className="w-full bg-bg-elevated border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors"
          />
        </form>

        <div className="flex items-center gap-1.5">
          {["all", "published", "draft", "archived"].map(s => (
            <Link
              key={s}
              href={`/articles?status=${s}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                (params.status ?? "all") === s
                  ? "bg-accent/10 text-accent"
                  : "text-ink-muted hover:text-ink hover:bg-bg-elevated"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
        {list.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-sm text-ink-muted">No articles found.</p>
            <Link href="/articles/new" className="text-sm text-accent hover:underline mt-1 inline-block">
              Create your first article →
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Updated</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map(article => (
                <tr key={article.id} className="hover:bg-bg-card/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <p className="text-sm font-medium text-ink group-hover:text-accent transition-colors">
                      {truncate(article.title, 60)}
                    </p>
                    <p className="text-xs text-ink-faint mt-0.5 font-mono">{article.slug}</p>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    <span className="text-xs text-ink-muted">
                      {article.category_name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={article.status} />
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <span className="text-xs text-ink-muted">{formatDate(article.updated_at)}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/articles/${article.id}/edit`}
                        className="p-1.5 rounded-md hover:bg-bg-elevated text-ink-muted hover:text-ink transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      {article.status === "published" && (
                        <a
                          href={`https://bidev.dev/blog/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-md hover:bg-bg-elevated text-ink-muted hover:text-ink transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
