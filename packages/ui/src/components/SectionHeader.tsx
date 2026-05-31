import React from "react";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center items-center" : "";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold text-ink">{title}</h2>
      {description && (
        <p className={`text-ink-muted leading-relaxed ${align === "center" ? "max-w-2xl mx-auto" : "max-w-xl"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
