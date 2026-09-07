"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery("");
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="p-2 text-ink-muted hover:text-ink transition-colors"
      >
        <Search className="w-4 h-4" />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-paper-sunken border border-border px-3 py-1.5">
      <Search className="w-3.5 h-3.5 text-ink-faint shrink-0" />
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search stories…"
        aria-label="Search stories"
        className="bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none w-40"
      />
      <button type="button" onClick={() => setOpen(false)} aria-label="Close search">
        <X className="w-3.5 h-3.5 text-ink-faint hover:text-ink transition-colors" />
      </button>
    </form>
  );
}
