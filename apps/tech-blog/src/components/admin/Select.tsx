import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function Select({ label, hint, options, placeholder, className, id, ...props }: SelectProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label && <label htmlFor={inputId} className="block text-xs font-medium text-ink-muted">{label}</label>}
      <div className="relative">
        <select
          id={inputId}
          className={cn(
            "w-full appearance-none bg-paper-raised border border-border px-3 py-2 pr-8 text-sm text-ink",
            "focus:outline-none focus:ring-1 focus:ring-accent/50 focus:border-accent/50 transition-colors",
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted pointer-events-none" />
      </div>
      {hint && <p className="text-xs text-ink-faint">{hint}</p>}
    </div>
  );
}
