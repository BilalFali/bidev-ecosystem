// Lightweight, dependency-free editorial bar chart. No charting library —
// this is intentionally simple; reach for something heavier only once a
// real need (interactivity, tooltips) outgrows plain SVG.

interface DataPoint {
  label: string;
  value: number;
}

export function BarChart({ data, unit = "" }: { data: DataPoint[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex flex-col gap-3 p-5 border border-border bg-paper-raised">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-ink-muted w-28 shrink-0 truncate">{d.label}</span>
          <div className="flex-1 h-2 bg-paper-sunken relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-data"
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs text-ink w-16 text-right shrink-0">
            {d.value}{unit}
          </span>
        </div>
      ))}
    </div>
  );
}
