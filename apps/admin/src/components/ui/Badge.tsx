import { cn } from "@/lib/utils";
import type { ArticleStatus } from "@/lib/types/database";

type Variant = "default" | "success" | "warning" | "danger" | "info" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  dot?: boolean;
  className?: string;
}

const variants: Record<Variant, string> = {
  default: "bg-accent/10 text-accent border-accent/20",
  success: "bg-green-500/10 text-green-400 border-green-500/20",
  warning: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  danger:  "bg-red-500/10 text-red-400 border-red-500/20",
  info:    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  muted:   "bg-bg-elevated text-ink-muted border-border",
};

export function Badge({ children, variant = "default", dot = false, className }: BadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border",
      variants[variant],
      className
    )}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: ArticleStatus }) {
  const map: Record<ArticleStatus, { variant: Variant; label: string }> = {
    published: { variant: "success",  label: "Published" },
    draft:     { variant: "warning",  label: "Draft"     },
    archived:  { variant: "muted",    label: "Archived"  },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant} dot>{label}</Badge>;
}
