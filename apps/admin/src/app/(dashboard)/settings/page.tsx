"use client";

import { useState, useEffect } from "react";
import { User, Save, MessageSquare, Megaphone, ArrowRight } from "lucide-react";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export default function SettingsPage() {
  const [email,    setEmail]    = useState("");

  // Comment settings
  const [autoApprove,    setAutoApprove]    = useState(true);
  const [savingComments, setSavingComments] = useState(false);
  const [commentMsg,     setCommentMsg]     = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [bannerEnabled, setBannerEnabled] = useState(false);
  const [bannerText, setBannerText] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [savingBanner, setSavingBanner] = useState(false);
  const [bannerMsg, setBannerMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/access")
      .then(r => r.json())
      .then((data: { email?: string }) => setEmail(data.email ?? ""));
    fetch("/api/admin/settings?keys=auto_approve_comments,announcement_banner")
      .then(async r => {
        const d = await r.json() as { settings?: Record<string, string>; error?: string };
        if (!r.ok) throw new Error(d.error ?? "Unable to load settings.");
        return d;
      })
      .then(d => {
        const settings = d.settings ?? {};
        setAutoApprove(settings["auto_approve_comments"] !== "false");
        if (settings.announcement_banner) {
          const banner = JSON.parse(settings.announcement_banner) as {
            enabled: boolean;
            text: string;
            url: string;
          };
          setBannerEnabled(banner.enabled);
          setBannerText(banner.text);
          setBannerUrl(banner.url);
        }
      })
      .catch(() => {
        setBannerMsg({ type: "error", text: "Unable to load site settings. Refresh and try again." });
      });
  }, []);

  async function handleBannerSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingBanner(true);
    setBannerMsg(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "announcement_banner",
          value: JSON.stringify({
            enabled: bannerEnabled,
            text: bannerText.trim(),
            url: bannerUrl.trim(),
          }),
        }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error ?? "Failed to save banner settings.");
      setBannerMsg({ type: "success", text: "Announcement banner saved." });
    } catch (error) {
      setBannerMsg({
        type: "error",
        text: error instanceof Error ? error.message : "Network error.",
      });
    } finally {
      setSavingBanner(false);
    }
  }

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

  return (
    <div className="max-w-xl mx-auto animate-fade-in">
      <DashboardHeader title="Settings" description="Account & workspace settings" />

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

      {/* Announcement banner */}
      <div className="bg-bg-elevated border border-border rounded-xl overflow-hidden mb-5">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <Megaphone className="w-4 h-4 text-ink-muted" />
          <h2 className="text-sm font-semibold text-ink">Top Announcement Banner</h2>
        </div>
        <form onSubmit={handleBannerSettings} className="px-5 py-4 space-y-4">
          {bannerMsg && (
            <Alert type={bannerMsg.type} message={bannerMsg.text} onDismiss={() => setBannerMsg(null)} />
          )}
          <label className="flex items-center justify-between gap-4 cursor-pointer select-none">
            <div>
              <p className="text-sm font-medium text-ink">Show banner on the website</p>
              <p className="text-xs text-ink-faint mt-0.5">
                Visitors see a clickable gradient banner above the site header.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={bannerEnabled}
              onClick={() => setBannerEnabled(!bannerEnabled)}
              className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${bannerEnabled ? "bg-accent" : "bg-bg-card border border-border"}`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${bannerEnabled ? "translate-x-5" : ""}`}
              />
            </button>
          </label>
          <Input
            label="Banner message"
            value={bannerText}
            onChange={e => setBannerText(e.target.value)}
            placeholder="Flutter 3.50 is live! Read the blog post"
            maxLength={180}
            required={bannerEnabled}
          />
          <Input
            label="Destination URL"
            value={bannerUrl}
            onChange={e => setBannerUrl(e.target.value)}
            placeholder="/blog/your-article or https://example.com"
            hint="Use a site path or a full HTTP(S) URL. The banner stays off until you enable it."
            maxLength={2048}
            required={bannerEnabled}
          />
          {bannerEnabled && bannerText.trim() && (
            <div className="overflow-hidden rounded-md border border-white/30 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-4 py-3 text-center text-sm font-semibold text-white">
              <span>{bannerText.trim()}</span>
              <ArrowRight aria-hidden="true" className="ml-2 inline h-4 w-4" />
            </div>
          )}
          <div className="flex justify-end">
            <Button type="submit" loading={savingBanner} size="sm">
              <Save className="w-3.5 h-3.5" />
              Save Banner
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
