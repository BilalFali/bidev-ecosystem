import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({ title, description, actions, className }: DashboardHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-xl font-bold text-ink">{title}</h1>
        {description && <p className="text-sm text-ink-muted mt-0.5">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}
