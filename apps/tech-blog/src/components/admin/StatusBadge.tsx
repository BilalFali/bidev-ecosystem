import { cn } from "@/lib/utils";

type Status = "draft" | "published" | "archived";

const config: Record<Status, string> = {
  published: "bg-green-50 text-green-700 border-green-200",
  draft:     "bg-yellow-50 text-yellow-700 border-yellow-200",
  archived:  "bg-paper-sunken text-ink-muted border-border",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border capitalize", config[status])}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
