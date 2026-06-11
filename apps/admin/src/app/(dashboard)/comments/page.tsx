import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { CommentActions } from "@/components/ui/CommentActions";
import { MessageSquare, Clock, CheckCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export const metadata = { title: "Comments" };
export const revalidate = 0;

interface Comment {
  id: string;
  article_slug: string;
  author_name: string;
  author_email: string | null;
  content: string;
  approved: boolean;
  created_at: string;
}

async function getComments() {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as any)
      .from("comments")
      .select("*")
      .order("created_at", { ascending: false });
    return (data ?? []) as Comment[];
  } catch {
    return [] as Comment[];
  }
}

export default async function CommentsPage() {
  const comments = await getComments();
  const pending  = comments.filter((c) => !c.approved);
  const approved = comments.filter((c) => c.approved);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <DashboardHeader
        title="Comments"
        description="Review and approve reader comments"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-xl border border-border bg-bg-elevated flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-ink-faint" />
          <div>
            <p className="text-xl font-bold text-ink">{comments.length}</p>
            <p className="text-xs text-ink-faint">Total</p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-xl font-bold text-ink">{pending.length}</p>
            <p className="text-xs text-ink-faint">Pending</p>
          </div>
        </div>
        <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div>
            <p className="text-xl font-bold text-ink">{approved.length}</p>
            <p className="text-xs text-ink-faint">Approved</p>
          </div>
        </div>
      </div>

      {/* Pending section */}
      {pending.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            Pending Review ({pending.length})
          </h2>
          <div className="rounded-xl border border-amber-500/20 overflow-hidden bg-bg-elevated divide-y divide-border">
            {pending.map((c) => (
              <CommentRow key={c.id} comment={c} />
            ))}
          </div>
        </div>
      )}

      {/* Approved section */}
      <div>
        <h2 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400" />
          Approved ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <div className="py-10 text-center text-sm text-ink-faint border border-dashed border-border rounded-xl">
            No approved comments yet.
          </div>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden bg-bg-elevated divide-y divide-border">
            {approved.map((c) => (
              <CommentRow key={c.id} comment={c} />
            ))}
          </div>
        )}
      </div>

      {comments.length === 0 && (
        <div className="py-16 text-center text-sm text-ink-faint border border-dashed border-border rounded-xl mt-4">
          <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p>No comments yet.</p>
          <p className="text-xs mt-1">They will appear here once readers start commenting.</p>
        </div>
      )}
    </div>
  );
}

function CommentRow({ comment: c }: { comment: Comment }) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          {/* Meta */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-sm font-semibold text-ink">{c.author_name}</span>
            {c.author_email && (
              <span className="text-xs text-ink-faint">&lt;{c.author_email}&gt;</span>
            )}
            <span className="text-xs text-ink-faint">·</span>
            <span className="text-xs text-ink-faint">{formatDate(c.created_at)}</span>
            <span className="text-xs text-ink-faint">·</span>
            <Link
              href={`https://bidev.site/blog/${c.article_slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline"
            >
              {c.article_slug}
            </Link>
          </div>
          {/* Content */}
          <p className="text-sm text-ink-muted whitespace-pre-wrap leading-relaxed line-clamp-4">
            {c.content}
          </p>
        </div>
        {/* Actions */}
        <CommentActions id={c.id} approved={c.approved} />
      </div>
    </div>
  );
}
