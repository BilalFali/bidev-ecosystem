"use client";

import { useEffect } from "react";

interface Props {
  type: "article" | "product" | "tool" | "snippet" | "page";
  slug: string;
  title?: string;
}

export function PageViewTracker({ type, slug, title = "" }: Props) {
  useEffect(() => {
    const key = `pv:${type}:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    fetch("/api/track", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ type, slug, title }),
    }).catch(() => {});
  }, [type, slug, title]);

  return null;
}
