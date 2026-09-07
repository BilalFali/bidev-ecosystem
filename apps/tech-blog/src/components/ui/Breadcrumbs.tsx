import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  name: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-ink-faint">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3 h-3" aria-hidden="true" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-ink transition-colors">{item.name}</Link>
          ) : (
            <span className="text-ink-muted truncate">{item.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
