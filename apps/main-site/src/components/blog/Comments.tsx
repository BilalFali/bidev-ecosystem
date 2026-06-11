"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface Comment {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins  < 1)  return "just now";
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days  < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Props { slug: string }

export function Comments({ slug }: Props) {
  const [comments, setComments]   = useState<Comment[]>([]);
  const [loading,  setLoading]    = useState(true);

  // Form state
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [content,  setContent]  = useState("");
  const [sending,  setSending]  = useState(false);
  const [sent,     setSent]     = useState(false);
  const [formErr,  setFormErr]  = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/comments?slug=${encodeURIComponent(slug)}`)
      .then((r) => r.json())
      .then((d: { comments: Comment[] }) => setComments(d.comments ?? []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sending || sent) return;
    setFormErr("");
    setSending(true);
    try {
      const res  = await fetch("/api/comments", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ slug, author_name: name, author_email: email, content }),
      });
      const data = await res.json() as { ok: boolean; error?: string };
      if (data.ok) {
        setSent(true);
        setName(""); setEmail(""); setContent("");
      } else {
        setFormErr(data.error ?? "Something went wrong.");
      }
    } catch {
      setFormErr("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-2">
      <h2 className="text-xl font-bold text-ink mb-6">
        Comments
        {!loading && comments.length > 0 && (
          <span className="ml-2 text-sm font-normal text-ink-faint">({comments.length})</span>
        )}
      </h2>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse h-20 rounded-xl bg-bg-elevated border border-border" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-10 text-center rounded-xl border border-dashed border-border text-ink-faint text-sm">
          No comments yet — be the first to leave one below.
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="flex gap-3">
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-accent text-sm font-bold uppercase">
                  {c.author_name.charAt(0)}
                </span>
              </div>
              {/* Bubble */}
              <div className="flex-1 min-w-0 bg-bg-elevated border border-border rounded-xl px-4 py-3">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-ink">{c.author_name}</span>
                  <span className="text-xs text-ink-faint">{timeAgo(c.created_at)}</span>
                </div>
                <p className="text-sm text-ink-muted whitespace-pre-wrap leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit form */}
      <div className="mt-8 rounded-xl border border-border bg-bg-elevated p-5">
        {sent ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">✓</p>
            <p className="font-medium text-ink mb-1">Comment submitted!</p>
            <p className="text-sm text-ink-faint">It will appear after review — usually within 24 hours.</p>
            <button
              onClick={() => setSent(false)}
              className="mt-4 text-xs text-accent hover:underline"
            >
              Leave another comment
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-ink mb-4">Leave a comment</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-ink-faint mb-1 block">Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    maxLength={80}
                    disabled={sending}
                    className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-faint mb-1 block">Email <span className="text-ink-faint/60">(optional, not shown)</span></label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={sending}
                    className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-ink-faint mb-1 block">Comment *</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts, questions, or feedback…"
                  required
                  rows={4}
                  maxLength={2000}
                  disabled={sending}
                  className="w-full px-3 py-2 rounded-lg bg-bg-card border border-border text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors resize-y disabled:opacity-60"
                />
                <p className="text-[11px] text-ink-faint/60 mt-1 text-right">
                  {content.length}/2000
                </p>
              </div>

              {formErr && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                  {formErr}
                </p>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs text-ink-faint">Comments are reviewed before publishing.</p>
                <button
                  type="submit"
                  disabled={sending}
                  className="px-5 py-2 rounded-lg bg-accent text-bg text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-60"
                >
                  {sending ? "Posting…" : "Post Comment"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
