import type { GeneratedArticle } from "./types.js";

const D1_DATABASE_ID = "93cd4bfb-81b4-465e-bc4a-77b13ef67e48";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} env var is missing`);
  return value;
}

async function d1Query<T = Record<string, unknown>>(sql: string, params: unknown[] = []): Promise<T[]> {
  const accountId = requireEnv("CLOUDFLARE_ACCOUNT_ID");
  const apiToken = requireEnv("CLOUDFLARE_API_TOKEN");
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${D1_DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sql, params }),
    }
  );
  const body = await response.json() as {
    success: boolean;
    errors?: Array<{ message?: string }>;
    result?: Array<{ results?: T[] }>;
  };
  if (!response.ok || !body.success) {
    throw new Error(body.errors?.[0]?.message ?? `D1 query failed (${response.status})`);
  }
  return body.result?.[0]?.results ?? [];
}

async function resolveTagIds(tagNames: string[]): Promise<string[]> {
  const ids: string[] = [];

  for (const name of tagNames) {
    const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
    if (!slug) continue;

    // upsert so duplicate runs are idempotent
    const id = crypto.randomUUID();
    await d1Query(
      `INSERT INTO tags (id, name, slug) VALUES (?, ?, ?)
       ON CONFLICT(slug) DO UPDATE SET name = excluded.name`,
      [id, name, slug]
    );
    const rows = await d1Query<{ id: string }>("SELECT id FROM tags WHERE slug = ?", [slug]);
    if (rows[0]?.id) ids.push(rows[0].id);
  }

  return ids;
}

export async function slugExists(slug: string): Promise<boolean> {
  const rows = await d1Query<{ count: number }>("SELECT COUNT(*) AS count FROM articles WHERE slug = ?", [slug]);
  return (rows[0]?.count ?? 0) > 0;
}

export async function saveDraft(article: GeneratedArticle): Promise<string> {
  const articleId = crypto.randomUUID();
  const tagIds = await resolveTagIds(article.suggested_tags);

  await d1Query(
    `INSERT INTO articles (
      id, title, slug, content, excerpt, status, seo_title,
      seo_description, seo_keywords, reading_time, featured
    ) VALUES (?, ?, ?, ?, ?, 'draft', ?, ?, ?, ?, 0)`,
    [
      articleId,
      article.title,
      article.slug,
      article.content,
      article.excerpt ?? null,
      article.seo_title ?? null,
      article.seo_description ?? null,
      JSON.stringify(article.seo_keywords ?? []),
      article.reading_time ?? null,
    ]
  );

  if (tagIds.length) {
    for (const tagId of tagIds) {
      await d1Query(
        "INSERT OR IGNORE INTO article_tags (article_id, tag_id) VALUES (?, ?)",
        [articleId, tagId]
      );
    }
  }

  return articleId;
}
