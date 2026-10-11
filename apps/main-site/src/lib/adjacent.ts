export interface Dated {
  slug: string;
  publishedAt: string;
  categorySlug?: string;
}

/** Neighbours by publish date inside the current article's category. prev is older, next is newer. */
export function pickAdjacent<T extends Dated>(
  all: T[],
  currentSlug: string,
): { prev: T | null; next: T | null } {
  const current = all.find((a) => a.slug === currentSlug);
  if (!current) return { prev: null, next: null };

  const pool = all
    .filter((a) => (current.categorySlug ? a.categorySlug === current.categorySlug : true))
    .sort((a, b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt) || a.slug.localeCompare(b.slug));

  const i = pool.findIndex((a) => a.slug === currentSlug);
  return {
    prev: i > 0 ? pool[i - 1] : null,
    next: i >= 0 && i < pool.length - 1 ? pool[i + 1] : null,
  };
}
