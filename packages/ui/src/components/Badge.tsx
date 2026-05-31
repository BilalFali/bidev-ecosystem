import React from "react";

type Color = "default" | "accent" | "green" | "yellow" | "red" | "purple";

interface BadgeProps {
  children: React.ReactNode;
  color?: Color;
  className?: string;
}

const colors: Record<Color, string> = {
  default: "bg-bg-elevated text-ink-muted border border-border",
  accent:  "bg-accent/10 text-accent border border-accent/20",
  green:   "bg-green-500/10 text-green-400 border border-green-500/20",
  yellow:  "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  red:     "bg-red-500/10 text-red-400 border border-red-500/20",
  purple:  "bg-purple-500/10 text-purple-400 border border-purple-500/20",
};

export function Badge({ children, color = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
