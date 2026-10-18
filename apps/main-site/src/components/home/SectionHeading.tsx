import Link from "next/link";

const TONES = {
  accent: "text-accent-light",
  teal: "text-teal",
  tertiary: "text-tertiary",
  danger: "text-danger",
} as const;

export function SectionHeading({
  eyebrow,
  tone = "accent",
  title,
  subtitle,
  href,
  linkLabel,
}: {
  eyebrow: string;
  tone?: keyof typeof TONES;
  title: string;
  subtitle?: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4 mb-7">
      <div>
        <p className={`font-mono text-xs mb-1.5 ${TONES[tone]}`}>{`// ${eyebrow}`}</p>
        <h2 className="text-xl sm:text-2xl font-bold text-ink">{title}</h2>
        {subtitle && <p className="text-sm text-ink-muted mt-1">{subtitle}</p>}
      </div>
      <Link href={href} className="text-sm text-accent-light hover:text-ink transition-colors whitespace-nowrap mb-1">
        {linkLabel}
      </Link>
    </div>
  );
}
