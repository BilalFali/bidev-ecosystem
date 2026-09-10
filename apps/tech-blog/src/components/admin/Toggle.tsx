"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
}

export function Toggle({ checked, onChange, label, description }: ToggleProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <button
        role="switch"
        type="button"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 border-2 border-transparent transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-1",
          checked ? "bg-accent" : "bg-paper-sunken border-border"
        )}
      >
        <span className={cn(
          "pointer-events-none inline-block h-4 w-4 bg-paper-raised shadow transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )} />
      </button>
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-ink leading-none">{label}</p>}
          {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
        </div>
      )}
    </label>
  );
}
