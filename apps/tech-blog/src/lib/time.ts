export function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const now  = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffHours < 1) {
    const mins = Math.max(1, Math.round(diffMs / (1000 * 60)));
    return `${mins}m ago`;
  }
  if (diffHours < 24) {
    return `${Math.round(diffHours)}h ago`;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
