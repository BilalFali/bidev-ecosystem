import { Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

const BMC_URL = "https://www.buymeacoffee.com/bilalfali6h";

interface Props {
  /** "banner" — full card at end of articles. "footer" — compact inline link. */
  variant?: "banner" | "footer";
  className?: string;
}

export function BuyMeCoffee({ variant = "banner", className }: Props) {
  if (variant === "footer") {
    return (
      <a
        href={BMC_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Support Bilal Fali on Buy Me a Coffee"
        className={cn(
          "inline-flex items-center gap-1.5 text-sm text-ink-faint hover:text-warning transition-colors",
          className
        )}
      >
        <Coffee className="w-3.5 h-3.5" />
        Buy me a coffee
      </a>
    );
  }

  // banner — end of article
  return (
    <div
      className={cn(
        "mt-12 rounded-2xl border border-warning/20 bg-warning/5 px-6 py-7",
        "flex flex-col sm:flex-row items-start sm:items-center gap-5",
        className
      )}
    >
      {/* Icon */}
      <div className="shrink-0 w-12 h-12 rounded-xl bg-warning/10 border border-warning/20 flex items-center justify-center">
        <Coffee className="w-6 h-6 text-warning" />
      </div>

      {/* Copy */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink mb-1">
          Did this article save you time?
        </p>
        <p className="text-sm text-ink-muted leading-relaxed">
          I write these for free. If it helped, a coffee keeps me going — and more articles coming.
        </p>
      </div>

      {/* CTA */}
      <a
        href={BMC_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Support Bilal Fali on Buy Me a Coffee"
        className={cn(
          "shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl",
          "bg-warning/10 border border-warning/30 text-warning text-sm font-semibold",
          "hover:bg-warning/20 hover:border-warning/50 transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warning/50"
        )}
      >
        <Coffee className="w-4 h-4" />
        Buy me a coffee
      </a>
    </div>
  );
}
