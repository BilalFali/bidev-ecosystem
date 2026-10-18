import { Terminal } from "lucide-react";

export function LogoMark({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "w-6 h-6" : "w-8 h-8";
  const icon = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  return (
    <span
      aria-hidden="true"
      className={`${box} rounded-lg bg-bg-elevated border border-border flex items-center justify-center text-accent-light`}
    >
      <Terminal className={icon} strokeWidth={2} />
    </span>
  );
}
