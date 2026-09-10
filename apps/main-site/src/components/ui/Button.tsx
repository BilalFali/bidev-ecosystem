import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Button — the site's one shared interactive-affordance component.
 *
 * Personality is drawn from the subject matter (a CLI is the one surface
 * every Flutter dev already trusts): primary actions carry a `$` prompt
 * glyph like a command about to run, and every variant "depresses" on
 * :active — translateY(1px) + a shrinking shadow — the way a physical key
 * or a terminal button gives way under a real press. That's the one press
 * feedback pattern used everywhere instead of a generic hover-lighten.
 *
 * Renders as a Next <Link> when `href` is given, otherwise a real <button>.
 */

type Variant = "primary" | "secondary" | "ghost";

const BASE =
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out " +
  "active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent " +
  "disabled:opacity-50 disabled:pointer-events-none " +
  "motion-reduce:transition-colors motion-reduce:active:translate-y-0";

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_1px_0_0_rgba(255,255,255,0.16)_inset,0_6px_16px_-6px_rgba(1,117,194,0.55)] " +
    "hover:bg-accent-hover active:shadow-[0_1px_0_0_rgba(255,255,255,0.08)_inset]",
  secondary:
    "border border-border bg-bg-card text-ink " +
    "hover:border-border-strong hover:bg-bg-elevated active:bg-bg-card",
  ghost:
    "text-ink-muted hover:text-ink hover:bg-bg-elevated active:bg-bg-card",
};

const SIZES = {
  sm: "px-4 py-2 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-sm",
};

interface CommonProps {
  variant?: Variant;
  size?: keyof typeof SIZES;
  /** Prefixes the label with a faint `$` command prompt — reserve for the
   *  single most important action on a page (a "run this" moment). */
  prompt?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

type LinkProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children"> & { href: string };

type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children"> & { href?: undefined };

export function Button(props: LinkProps | ButtonProps) {
  const { variant = "primary", size = "lg", prompt, icon, className = "", children, ...rest } = props;
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  const content = (
    <>
      {prompt && (
        <span aria-hidden="true" className="font-mono text-[0.9em] opacity-60 group-active/btn:opacity-90">
          $
        </span>
      )}
      {children}
      {icon}
    </>
  );

  if (props.href) {
    const { href, ...anchorRest } = rest as Omit<LinkProps, keyof CommonProps>;
    return (
      <Link href={href} className={classes} {...anchorRest}>
        {content}
      </Link>
    );
  }

  return (
    <button className={classes} {...(rest as Omit<ButtonProps, keyof CommonProps>)}>
      {content}
    </button>
  );
}
