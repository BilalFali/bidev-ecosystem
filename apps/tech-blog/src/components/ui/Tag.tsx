import Link from "next/link";

export function Tag({ label, href }: { label: string; href?: string }) {
  const cls = "text-xs px-2 py-0.5 rounded-sm border border-border text-ink-muted hover:text-ink hover:border-border-strong transition-colors";
  if (href) return <Link href={href} className={cls}>{label}</Link>;
  return <span className={cls}>{label}</span>;
}
