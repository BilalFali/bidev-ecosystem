import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T = Record<string, unknown>>(): Promise<{ results?: T[] }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}

interface D1Database {
  prepare(query: string): D1Statement;
}

declare global {
  interface CloudflareEnv {
    DB?: D1Database;
  }
}

type D1Row = Record<string, unknown>;

function parseJson(value: unknown, fallback: unknown = null): unknown {
  if (typeof value !== "string") return value ?? fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}

function serializeJson(value: unknown): string | null {
  if (value === undefined) return null;
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function uuid(): string {
  return crypto.randomUUID();
}

class D1Query {
  private table: string;
  private db: D1Database;
  private columns = "*";
  private filters: string[] = [];
  private params: unknown[] = [];
  private orderBy: string[] = [];
  private limitCount?: number;
  private mode: "select" | "insert" | "upsert" | "delete" = "select";
  private payload?: D1Row | D1Row[];
  private upsertKey?: string;
  private ignoreDuplicates = false;

  constructor(db: D1Database, table: string) {
    this.db = db;
    this.table = table;
  }

  select(columns = "*") { this.columns = columns; return this; }
  from(table: string) { this.table = table; return this; }

  eq(column: string, value: unknown) {
    this.filters.push(`"${column}" = ?`);
    this.params.push(value);
    return this;
  }
  neq(column: string, value: unknown) {
    this.filters.push(`"${column}" <> ?`);
    this.params.push(value);
    return this;
  }
  or(expression: string) {
    const match = expression.match(/^(\w+)\.(is\.null|gt\.[^,]+),(\w+)\.(gt\.)(.+)$/);
    if (match) {
      this.filters.push(`("${match[1]}" IS NULL OR "${match[3]}" > ?)`);
      this.params.push(match[5]);
    }
    return this;
  }
  order(column: string, options?: { ascending?: boolean }) {
    this.orderBy.push(`"${column}" ${options?.ascending === false ? "DESC" : "ASC"}`);
    return this;
  }
  limit(count: number) { this.limitCount = count; return this; }

  insert(payload: D1Row | D1Row[]) { this.mode = "insert"; this.payload = payload; return this; }
  upsert(payload: D1Row | D1Row[], options?: { onConflict?: string; ignoreDuplicates?: boolean }) {
    this.mode = "upsert";
    this.payload = payload;
    this.upsertKey = options?.onConflict;
    this.ignoreDuplicates = options?.ignoreDuplicates ?? false;
    return this;
  }
  delete() { this.mode = "delete"; return this; }

  private physicalTable(): string {
    if (this.table === "articles_with_relations") return "articles";
    return this.table;
  }

  private normalizeRow(row: D1Row): D1Row {
    const normalized = { ...row };
    for (const key of ["tags", "features", "whats_included", "requirements", "common_mistakes", "interview_tips", "related_slugs", "related_article_slugs", "related_tool_slugs", "symptoms", "causes", "solutions", "verification_steps", "affected_platforms", "technologies", "related_problems", "related_guides", "seo_keywords"]) {
      if (key in normalized) normalized[key] = parseJson(normalized[key], []);
    }
    for (const key of ["featured", "breaking", "approved", "active", "is_troubleshooting"]) {
      if (key in normalized) normalized[key] = Boolean(normalized[key]);
    }
    return normalized;
  }

  private async executeRelations(): Promise<D1Row[]> {
    const table = this.physicalTable();
    let sql = `SELECT * FROM "${table}"`;
    if (this.filters.length) sql += ` WHERE ${this.filters.join(" AND ")}`;
    if (this.orderBy.length) sql += ` ORDER BY ${this.orderBy.join(", ")}`;
    if (this.limitCount) sql += ` LIMIT ?`;
    const params = this.limitCount ? [...this.params, this.limitCount] : this.params;
    const result = await this.db.prepare(sql).bind(...params).all<D1Row>();
    const rows = (result.results ?? []).map((row) => this.normalizeRow(row));

    if (this.table === "articles_with_relations") {
      const enriched: D1Row[] = [];
      for (const article of rows) {
        const category = article.category_id
          ? await this.db.prepare("SELECT id, name, slug FROM categories WHERE id = ?").bind(article.category_id).first<D1Row>()
          : null;
        const troubleshootingCategory = article.troubleshooting_category_id
          ? await this.db.prepare("SELECT id, name, slug FROM troubleshooting_categories WHERE id = ?").bind(article.troubleshooting_category_id).first<D1Row>()
          : null;
        const articleTags = await this.db.prepare(
          "SELECT t.id, t.name, t.slug FROM tags t JOIN article_tags at ON at.tag_id = t.id WHERE at.article_id = ?"
        ).bind(article.id).all<D1Row>();
        enriched.push({
          ...article,
          category_name: category?.name ?? null,
          category_slug: category?.slug ?? null,
          troubleshooting_category_name: troubleshootingCategory?.name ?? null,
          troubleshooting_category_slug: troubleshootingCategory?.slug ?? null,
          tags: (articleTags.results ?? []).map((tag) => ({ id: tag.id, name: tag.name, slug: tag.slug })),
        });
      }
      return enriched;
    }
    return rows;
  }

  private preparePayload(row: D1Row): D1Row {
    const out = { ...row };
    for (const key of Object.keys(out)) {
      if (Array.isArray(out[key]) || (typeof out[key] === "object" && out[key] !== null)) {
        out[key] = serializeJson(out[key]);
      }
    }
    if (!out.id) out.id = uuid();
    return out;
  }

  private async executeWrite(): Promise<D1Row[]> {
    const rows = Array.isArray(this.payload) ? this.payload : [this.payload ?? {}];
    if (this.mode === "delete") {
      if (!this.filters.length) throw new Error("Refusing to delete without filters");
      await this.db.prepare(`DELETE FROM "${this.physicalTable()}"`
        + ` WHERE ${this.filters.join(" AND ")}`).bind(...this.params).run();
      return [];
    }

    for (const raw of rows) {
      const row = this.preparePayload(raw);
      const columns = Object.keys(row);
      const placeholders = columns.map(() => "?").join(", ");
      let sql = `INSERT ${this.ignoreDuplicates ? "OR IGNORE " : ""}INTO "${this.physicalTable()}" (${columns.map((c) => `"${c}"`).join(", ")}) VALUES (${placeholders})`;
      if (this.mode === "upsert" && this.upsertKey) {
        const conflictColumns = this.upsertKey.split(",").map((c) => c.trim()).filter(Boolean);
        const updateColumns = columns.filter((c) => !conflictColumns.includes(c));
        if (updateColumns.length) {
          sql += ` ON CONFLICT (${conflictColumns.map((c) => `"${c}"`).join(", ")}) DO UPDATE SET ${updateColumns.map((c) => `"${c}" = excluded."${c}"`).join(", ")}`;
        } else {
          sql += ` ON CONFLICT (${conflictColumns.map((c) => `"${c}"`).join(", ")}) DO NOTHING`;
        }
      }
      await this.db.prepare(sql).bind(...columns.map((c) => row[c])).run();
    }
    return rows.map((row) => this.normalizeRow(row));
  }

  async maybeSingle(): Promise<{ data: D1Row | null; error: unknown | null }> {
    const rows = await this.executeRelations();
    return { data: rows[0] ?? null, error: null };
  }
  async single(): Promise<{ data: D1Row | null; error: unknown | null }> {
    const result = await this.maybeSingle();
    return result.data ? result : { data: null, error: new Error("No row found") };
  }
  then<TResult1 = { data: D1Row[]; error: unknown | null }, TResult2 = never>(
    onfulfilled?: ((value: { data: D1Row[]; error: unknown | null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ): Promise<TResult1 | TResult2> {
    return (async () => {
      try {
        const data = this.mode === "select" ? await this.executeRelations() : await this.executeWrite();
        return { data, error: null };
      } catch (error) {
        return { data: [], error };
      }
    })().then(onfulfilled, onrejected);
  }
}

export function getSupabaseClient() {
  let db: D1Database | undefined;
  try {
    db = getCloudflareContext({ async: false }).env.DB;
  } catch {
    try {
      db = (globalThis as unknown as { DB?: D1Database }).DB;
    } catch {
      db = undefined;
    }
  }
  if (!db) return null;

  return {
    from(table: string) {
      return new D1Query(db!, table);
    },
    async rpc(name: string, params: D1Row) {
      if (name === "upsert_page_view") {
        const now = new Date().toISOString();
        await db!.prepare(
          `INSERT INTO page_views (id, page_type, page_slug, page_title, views, last_viewed_at)
           VALUES (?, ?, ?, ?, 1, ?)
           ON CONFLICT(page_type, page_slug) DO UPDATE SET
             views = views + 1,
             last_viewed_at = excluded.last_viewed_at,
             page_title = CASE WHEN excluded.page_title <> '' THEN excluded.page_title ELSE page_views.page_title END`
        ).bind(uuid(), params.p_type, params.p_slug, params.p_title ?? "", now).run();
      }
      if (name === "increment_article_views") {
        await db!.prepare(
          "UPDATE articles SET views = views + 1, updated_at = ? WHERE slug = ?"
        ).bind(new Date().toISOString(), params.article_slug).run();
      }
      return { data: null, error: null };
    },
  };
}
