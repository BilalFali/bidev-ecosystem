"use client";

import { useEffect } from "react";

export function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // Only count once per session per article
    const key = `viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/views", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ slug }),
    }).catch(() => {});
  }, [slug]);

  return null;
}
