"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  separator?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: "left" | "right";
}

export function Dropdown({ trigger, items, align = "right" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <div onClick={() => setOpen(v => !v)}>{trigger}</div>
      {open && (
        <div className={cn(
          "absolute top-full mt-1.5 z-50 min-w-[160px] bg-bg-elevated border border-border rounded-xl shadow-xl py-1 animate-slide-down",
          align === "right" ? "right-0" : "left-0"
        )}>
          {items.map((item, i) => (
            <div key={i}>
              {item.separator && i > 0 && <hr className="border-border my-1" />}
              <button
                onClick={() => { item.onClick(); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                  item.danger
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-ink-muted hover:text-ink hover:bg-bg-card"
                )}
              >
                {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                {item.label}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
