"use client";

import { useEffect, useRef } from "react";

const REPO         = "BilalFali/bidev-ecosystem";
const REPO_ID      = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
const CATEGORY_ID  = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;

export function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!REPO_ID || !CATEGORY_ID || !ref.current) return;
    if (ref.current.querySelector("iframe")) return;

    const script = document.createElement("script");
    script.src              = "https://giscus.app/client.js";
    script.setAttribute("data-repo",              REPO);
    script.setAttribute("data-repo-id",           REPO_ID);
    script.setAttribute("data-category-id",       CATEGORY_ID);
    script.setAttribute("data-mapping",           "pathname");
    script.setAttribute("data-strict",            "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata",     "0");
    script.setAttribute("data-input-position",    "top");
    script.setAttribute("data-theme",             "dark");
    script.setAttribute("data-lang",              "en");
    script.setAttribute("data-loading",           "lazy");
    script.crossOrigin = "anonymous";
    script.async       = true;

    ref.current.appendChild(script);
  }, []);

  if (!REPO_ID || !CATEGORY_ID) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-ink-muted">
        <p className="font-medium text-ink mb-1">Comments not configured</p>
        <p className="text-xs">
          Set <code className="text-accent">NEXT_PUBLIC_GISCUS_REPO_ID</code> and{" "}
          <code className="text-accent">NEXT_PUBLIC_GISCUS_CATEGORY_ID</code> in your environment variables.
          Get them at{" "}
          <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
            giscus.app
          </a>.
        </p>
      </div>
    );
  }

  return <div ref={ref} />;
}
