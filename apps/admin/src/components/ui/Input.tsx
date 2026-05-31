import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-medium text-ink-muted uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full bg-bg-card border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-faint",
          "focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors",
          error ? "border-red-500/50" : "border-border",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
