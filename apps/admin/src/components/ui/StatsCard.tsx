import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  accent?: boolean;
}

export function StatsCard({ label, value, icon: Icon, trend, accent }: StatsCardProps) {
  return (
    <div className={cn(
      "bg-bg-elevated border rounded-xl p-5 flex flex-col gap-3",
      accent ? "border-accent/20 bg-accent/5" : "border-border"
    )}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink-muted uppercase tracking-wide">{label}</p>
        <span className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center",
          accent ? "bg-accent/10 text-accent" : "bg-bg-card text-ink-muted"
        )}>
          <Icon className="w-4 h-4" />
        </span>
      </div>
      <p className="text-2xl font-bold text-ink">{value}</p>
      {trend && (
        <p className={cn("text-xs", trend.value >= 0 ? "text-green-400" : "text-red-400")}>
          {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
        </p>
      )}
    </div>
  );
}
