"use client";

import { useState } from "react";
import { PartyPopper } from "lucide-react";

type Status = "idle" | "loading" | "success" | "error";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { ok: boolean; error?: string };
      if (data.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Check your connection.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-2 py-2">
        <PartyPopper className="w-6 h-6 text-accent" strokeWidth={1.75} />
        <p className="text-sm font-medium text-ink">You&apos;re subscribed!</p>
        <p className="text-xs text-ink-faint">We&apos;ll let you know when new content drops.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === "loading"}
        className="flex-1 px-4 py-3 rounded-lg bg-bg-card border border-border text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent transition-colors text-sm disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-6 py-3 rounded-lg bg-accent text-bg font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-60"
      >
        {status === "loading" ? "Subscribing…" : "Subscribe"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400 sm:absolute sm:bottom-[-1.5rem] sm:left-0 w-full text-center">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
