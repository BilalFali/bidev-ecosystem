"use client";

import { useState, useEffect } from "react";
import { User, KeyRound, Save, MessageSquare } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/client";

export default function SettingsPage() {
  const [email,    setEmail]    = useState("");
  const [newPw,    setNewPw]    = useState("");
  const [confirmPw,setConfirmPw]= useState("");
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Comment settings
  const [autoApprove,    setAutoApprove]    = useState(true);
  const [savingComments, setSavingComments] = useState(false);
  const [commentMsg,     setCommentMsg]     = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
    // Load comment settings
    fetch("/api/admin/settings?keys=auto_approve_comments")
      .then(r => r.json())
      .then((d: { settings: Record<string, string> }) => {
        setAutoApprove(d.settings["auto_approve_comments"] !== "false");
      })
      .catch(() => {});
  }, []);

  async function handleCommentSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingComments(true);
    setCommentMsg(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "auto_approve_comments", value: autoApprove ? "true" : "false" }),
      });
      const data = await res.json() as { ok: boolean };
      setCommentMsg(data.ok
        ? { type: "success", text: "Comment settings saved." }
        : { type: "error",   text: "Failed to save. Try again." }
      );
    } catch {
      setCommentMsg({ type: "error", text: "Network error." });
    } finally {
      setSavingComments(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    if (newPw !== confirmPw) { setMsg({ type: "error", text: "Passwords do not match." }); return; }
    if (newPw.length < 8)   { setMsg({ type: "error", text: "Password must be at least 8 characters." }); return; }

    setSaving(true); setMsg(null);
    const { error } = await createClient().auth.updateUser({ password: newPw });
    setSaving(false);
    setNewPw(""); setConfirmPw("");
    setMsg(error
      ? { type: "error", text: error.message }
      : { type: "success", text: "Password updated successfully." }
    );
  }

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <DashboardHeader title="Settings" description="Account & workspace settings" />

      {msg && (
        <div className="mb-5">
          <Alert type={msg.type} message={msg.text} onDismiss={() => setMsg(null)} />
        </div>
      )}

      {/* Account */}
      <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden mb-5">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <User className="w-4 h-4 text-ink-muted" />
          <h2 className="text-sm font-semibold text-ink">Account</h2>
        </div>
        <div className="px-5 py-4">
          <Input label="Email" value={email} disabled hint="Contact support to change your email address." />
        </div>
      </div>

      {/* Password */}
      <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden mb-5">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <KeyRound className="w-4 h-4 text-ink-muted" />
          <h2 className="text-sm font-semibold text-ink">Change Password</h2>
        </div>
        <form onSubmit={handlePasswordChange} className="px-5 py-4 space-y-4">
          <Input
            label="New Password"
            type="password"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
            placeholder="••••••••"
            required
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPw}
            onChange={e => setConfirmPw(e.target.value)}
            placeholder="••••••••"
            required
          />
          <div className="flex justify-end">
            <Button type="submit" loading={saving} size="sm">
              <Save className="w-3.5 h-3.5" />
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* Comments */}
      <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <MessageSquare className="w-4 h-4 text-ink-muted" />
          <h2 className="text-sm font-semibold text-ink">Comments</h2>
        </div>
        <form onSubmit={handleCommentSettings} className="px-5 py-4 space-y-4">
          {commentMsg && (
            <Alert type={commentMsg.type} message={commentMsg.text} onDismiss={() => setCommentMsg(null)} />
          )}
          <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
            <div>
              <p className="text-sm font-medium text-ink">Auto-approve comments</p>
              <p className="text-xs text-ink-faint mt-0.5">
                {autoApprove
                  ? "New comments appear immediately on articles."
                  : "New comments are held for review in the Comments tab."}
              </p>
            </div>
            {/* Toggle */}
            <button
              type="button"
              role="switch"
              aria-checked={autoApprove}
              onClick={() => setAutoApprove(!autoApprove)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${autoApprove ? "bg-accent" : "bg-bg-card border border-border"}`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${autoApprove ? "translate-x-5" : ""}`}
              />
            </button>
          </label>
          <div className="flex justify-end">
            <Button type="submit" loading={savingComments} size="sm">
              <Save className="w-3.5 h-3.5" />
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
