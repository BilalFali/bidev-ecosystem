import { formatDate } from "@/lib/utils";

export function AuthorMeta({
  author,
  publishedAt,
  updatedAt,
  readingTime,
}: {
  author: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted divide-x divide-border [&>*:not(:first-child)]:pl-4">
      <span className="font-medium text-ink">{author}</span>
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      {updatedAt && updatedAt !== publishedAt && <span>Updated {formatDate(updatedAt)}</span>}
      <span>{readingTime} min read</span>
    </div>
  );
}
