"use client";

import { useEffect, useRef } from "react";

const COPY_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 15 4 10"/></svg>`;

export function ProseContent({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.querySelectorAll("pre").forEach((pre) => {
      if (pre.querySelector("[data-copy]")) return;

      const code = pre.querySelector("code")?.innerText ?? "";

      // Make pre relative so button can be absolute inside it
      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.setAttribute("data-copy", "true");
      btn.setAttribute("aria-label", "Copy code");
      btn.innerHTML = COPY_ICON;
      btn.className = [
        "absolute top-2.5 right-2.5",
        "p-1.5 rounded-md",
        "bg-white/10 hover:bg-white/20",
        "text-white/50 hover:text-white",
        "transition-all duration-150",
        "opacity-0 focus:opacity-100",
      ].join(" ");

      pre.addEventListener("mouseenter", () => { btn.style.opacity = "1"; });
      pre.addEventListener("mouseleave", () => { btn.style.opacity = "0"; });

      btn.addEventListener("click", () => {
        navigator.clipboard.writeText(code).then(() => {
          btn.innerHTML = CHECK_ICON;
          btn.classList.add("text-green-400");
          setTimeout(() => {
            btn.innerHTML = COPY_ICON;
            btn.classList.remove("text-green-400");
          }, 2000);
        });
      });

      pre.appendChild(btn);
    });
  }, []);

  return (
    <div ref={ref} className="prose prose-invert max-w-none">
      {children}
    </div>
  );
}
