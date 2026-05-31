import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  counter?: { current: number; max: number };
}

export function Textarea({ label, error, hint, counter, className, id, ...props }: TextareaProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {(label || counter) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={inputId} className="block text-xs font-medium text-ink-muted uppercase tracking-wide">
              {label}
            </label>
          )}
          {counter && (
            <span className={cn("text-xs", counter.current > counter.max ? "text-red-400" : "text-ink-faint")}>
              {counter.current}/{counter.max}
            </span>
          )}
        </div>
      )}
      <textarea
        id={inputId}
        className={cn(
          "w-full bg-bg-card border rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-faint",
          "focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors",
          "resize-y min-h-[80px]",
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
