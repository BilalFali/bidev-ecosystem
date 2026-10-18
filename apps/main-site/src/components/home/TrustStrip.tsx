import Link from "next/link";
import { BadgeCheck, Smartphone, ShieldCheck } from "lucide-react";
import { PORTFOLIO_URL } from "@/lib/site-links";

const ITEMS = [
  {
    icon: BadgeCheck,
    title: "Built by Bilal Fali",
    text: "A Flutter developer who ships real apps.",
    href: PORTFOLIO_URL,
  },
  {
    icon: Smartphone,
    title: "Apps live on Google Play",
    text: "See the production apps behind these guides.",
    href: `${PORTFOLIO_URL}/work`,
  },
  {
    icon: ShieldCheck,
    title: "Free tools, no sign-up",
    text: "Instant, and they run in your browser.",
    href: "/tools",
  },
];

export function TrustStrip() {
  return (
    <section aria-label="About this site" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-border py-5">
        {ITEMS.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="group flex items-center gap-3 rounded-lg px-2 py-1 hover:bg-bg-card transition-colors"
          >
            <span className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent-light shrink-0">
              <item.icon className="w-4 h-4" strokeWidth={1.75} />
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink group-hover:text-accent-light transition-colors">{item.title}</span>
              <span className="block text-xs text-ink-muted">{item.text}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
