import React from "react";

type SlotType = "banner" | "in-article" | "sidebar" | "footer";

interface AdSlotProps {
  type?: SlotType;
  className?: string;
}

const slotStyles: Record<SlotType, { height: string; label: string }> = {
  "banner":     { height: "h-24",  label: "Advertisement – 728×90" },
  "in-article": { height: "h-28",  label: "Advertisement – 336×280" },
  "sidebar":    { height: "h-64",  label: "Advertisement – 300×250" },
  "footer":     { height: "h-20",  label: "Advertisement – 728×90" },
};

export function AdSlot({ type = "banner", className = "" }: AdSlotProps) {
  const { height, label } = slotStyles[type];

  return (
    <div
      aria-hidden="true"
      className={`w-full ${height} flex items-center justify-center rounded-lg border border-dashed border-border bg-bg-secondary ${className}`}
    >
      <span className="text-xs text-ink-faint select-none tracking-wide uppercase">
        {label}
      </span>
    </div>
  );
}
