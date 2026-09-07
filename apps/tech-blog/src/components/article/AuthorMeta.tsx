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
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
      <span className="font-medium text-ink">{author}</span>
      <span aria-hidden="true">·</span>
      <time dateTime={publishedAt}>{formatDate(publishedAt)}</time>
      {updatedAt && updatedAt !== publishedAt && (
        <>
          <span aria-hidden="true">·</span>
          <span>Updated {formatDate(updatedAt)}</span>
        </>
      )}
      <span aria-hidden="true">·</span>
      <span>{readingTime} min read</span>
    </div>
  );
}
