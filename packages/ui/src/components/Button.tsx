import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size    = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  href?: string;
  children: React.ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:   "bg-accent text-bg hover:bg-accent-hover shadow-[0_0_20px_rgba(34,211,238,0.15)] hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]",
  secondary: "border border-border bg-bg-card text-ink hover:border-border-strong hover:bg-bg-elevated",
  ghost:     "text-ink-muted hover:text-ink hover:bg-bg-elevated",
  danger:    "bg-red-500 text-white hover:bg-red-600",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  href,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {loading ? <Dots /> : children}
      </a>
    );
  }

  return (
    <button className={cls} disabled={loading || props.disabled} {...props}>
      {loading ? <Dots /> : children}
    </button>
  );
}

function Dots() {
  return (
    <span className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1 rounded-full bg-current animate-pulse"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
