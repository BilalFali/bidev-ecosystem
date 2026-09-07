import { ArrowUp, ArrowDown } from "lucide-react";

interface DataCardProps {
  value: string;
  label: string;
  trend?: "up" | "down";
  trendLabel?: string;
  tone?: "positive" | "warning";
}

export function DataCard({ value, label, trend, trendLabel, tone = "positive" }: DataCardProps) {
  const trendColor = tone === "positive" ? "text-data" : "text-accent";
  return (
    <div className="flex flex-col gap-1.5 p-5 border border-border bg-paper-raised">
      <span className="font-mono text-3xl font-medium text-ink">{value}</span>
      <span className="text-sm text-ink-muted">{label}</span>
      {trend && trendLabel && (
        <span className={`inline-flex items-center gap-1 text-xs font-mono mt-1 ${trendColor}`}>
          {trend === "up" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {trendLabel}
        </span>
      )}
    </div>
  );
}
