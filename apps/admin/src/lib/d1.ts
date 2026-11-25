import { getCloudflareContext } from "@opennextjs/cloudflare";

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  all<T = Record<string, unknown>>(): Promise<{ results?: T[] }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  run(): Promise<unknown>;
}
interface D1Database { prepare(query: string): D1Statement; }
declare global {
  interface CloudflareEnv { DB?: D1Database; }
}
type Row = Record<string, unknown>;
type QueryError = { message: string };

function uuid() { return crypto.randomUUID(); }
function parseJson(value: unknown, fallback: unknown = null): unknown {
  if (typeof value !== "string") return value ?? fallback;
  try { return JSON.parse(value); } catch { return fallback; }
}
function serializeJson(value: unknown): string | null {
  if (value === undefined) return null;
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}
function getDb(_binding: "DB" = "DB"): D1Database | null {
  try {
    const env = getCloudflareContext({ async: false }).env;
    return env.DB ?? null;
  } catch {
    return (globalThis as unknown as Record<string, D1Database | undefined>).DB ?? null;
  }
}

export class D1Query {
  private db: D1Database;
  private tableName: string;
  private countMode = false;
  private headOnly = false;
  private filters: string[] = [];
  private params: unknown[] = [];
  private orderBy: string[] = [];
  private limitCount?: number;
  private mode: "select" | "insert" | "update" | "upsert" | "delete" = "select";
  private payload?: Row | Row[];
  private upsertKey?: string;
  private ignoreDuplicates = false;

  constructor(db: D1Database, tableName: string) { this.db = db; this.tableName = tableName; }
  select(_columns = "*", options?: { count?: "exact"; head?: boolean }) {
    this.countMode = Boolean(options?.count);
    this.headOnly = Boolean(options?.head);
    return this;
  }
  eq(column: string, value: unknown) { this.filters.push(`"${column}" = ?`); this.params.push(value); return this; }
  neq(column: string, value: unknown) { this.filters.push(`"${column}" <> ?`); this.params.push(value); return this; }
  ilike(column: string, pattern: string) { this.filters.push(`"${column}" LIKE ? COLLATE NOCASE`); this.params.push(pattern); return this; }
  in(column: string, values: unknown[]) {
    if (!values.length) this.filters.push("1 = 0");
    else { this.filters.push(`"${column}" IN (${values.map(() => "?").join(", ")})`); this.params.push(...values); }
    return this;
  }
  gte(column: string, value: unknown) { this.filters.push(`"${column}" >= ?`); this.params.push(value); return this; }
  gt(column: string, value: unknown) { this.filters.push(`"${column}" > ?`); this.params.push(value); return this; }
  or(expression: string) {
    const match = expression.match(/^(\w+)\.(is\.null|gt\.[^,]+),(\w+)\.(gt\.)(.+)$/);
    if (match) { this.filters.push(`("${match[1]}" IS NULL OR "${match[3]}" > ?)`); this.params.push(match[5]); }
    return this;
  }
  order(column: string, options?: { ascending?: boolean }) {
    this.orderBy.push(`"${column}" ${options?.ascending === false ? "DESC" : "ASC"}`);
    return this;
  }
  limit(count: number) { this.limitCount = count; return this; }
  insert(payload: Row | Row[]) { this.mode = "insert"; this.payload = payload; return this; }
  update(payload: Row) { this.mode = "update"; this.payload = payload; return this; }
  upsert(payload: Row | Row[], options?: { onConflict?: string; ignoreDuplicates?: boolean }) {
    this.mode = "upsert"; this.payload = payload; this.upsertKey = options?.onConflict;
    this.ignoreDuplicates = options?.ignoreDuplicates ?? false; return this;
  }
  delete() { this.mode = "delete"; return this; }

  private normalize(row: Row): Row {
    const out = { ...row };
    for (const key of ["tags", "features", "whats_included", "requirements", "common_mistakes", "interview_tips", "related_slugs", "related_article_slugs", "related_tool_slugs", "symptoms", "causes", "solutions", "verification_steps", "affected_platforms", "technologies", "related_problems", "related_guides", "seo_keywords"]) {
      if (key in out) out[key] = parseJson(out[key], []);
    }
    for (const key of ["featured", "breaking", "approved", "active", "is_troubleshooting"]) {
      if (key in out) out[key] = Boolean(out[key]);
    }
    return out;
  }
  private prepare(row: Row): Row {
    const out = { ...row };
    for (const key of Object.keys(out)) {
      if (Array.isArray(out[key]) || (typeof out[key] === "object" && out[key] !== null)) out[key] = serializeJson(out[key]);
    }
    if (!out.id) out.id = uuid();
    return out;
  }
  private physicalTable() {
    if (this.tableName === "articles_with_relations") return "articles";
    return this.tableName;
  }
  private async enrich(rows: Row[]): Promise<Row[]> {
    if (this.tableName !== "articles_with_relations") return rows;
    const categoryTable = "categories";
    const tagsTable = "tags";
    const joinTable = "article_tags";
    const output: Row[] = [];
    for (const row of rows) {
      const category = row.category_id
        ? await this.db.prepare(`SELECT id, name, slug FROM "${categoryTable}" WHERE id = ?`).bind(row.category_id).first<Row>()
        : null;
      const tags = await this.db.prepare(
        `SELECT t.id, t.name, t.slug FROM "${tagsTable}" t JOIN "${joinTable}" at ON at.tag_id = t.id WHERE at.article_id = ?`
      ).bind(row.id).all<Row>();
      const enriched: Row = {
        ...row,
        category_name: category?.name ?? null,
        category_slug: category?.slug ?? null,
        tags: (tags.results ?? []).map((tag) => ({ id: tag.id, name: tag.name, slug: tag.slug })),
      };
      if (row.troubleshooting_category_id) {
        const tc = await this.db.prepare("SELECT id, name, slug FROM troubleshooting_categories WHERE id = ?").bind(row.troubleshooting_category_id).first<Row>();
        enriched.troubleshooting_category_name = tc?.name ?? null;
        enriched.troubleshooting_category_slug = tc?.slug ?? null;
      }
      output.push(enriched);
    }
    return output;
  }
  private async selectRows(): Promise<Row[]> {
    let sql = `SELECT * FROM "${this.physicalTable()}"`;
    if (this.filters.length) sql += ` WHERE ${this.filters.join(" AND ")}`;
    if (this.orderBy.length) sql += ` ORDER BY ${this.orderBy.join(", ")}`;
    if (this.limitCount) sql += ` LIMIT ?`;
    const params = this.limitCount ? [...this.params, this.limitCount] : this.params;
    const result = await this.db.prepare(sql).bind(...params).all<Row>();
    return this.enrich((result.results ?? []).map((row) => this.normalize(row)));
  }
  private async writeRows(): Promise<Row[]> {
    if (this.mode === "delete") {
      if (!this.filters.length) throw new Error("Refusing to delete without filters");
      await this.db.prepare(`DELETE FROM "${this.physicalTable()}" WHERE ${this.filters.join(" AND ")}`).bind(...this.params).run();
      return [];
    }
    const rows = Array.isArray(this.payload) ? this.payload : [this.payload ?? {}];
    for (const raw of rows) {
      const row = this.prepare(raw);
      if (this.mode === "update") {
        const keys = Object.keys(row).filter((key) => key !== "id");
        if (!this.filters.length) throw new Error("Refusing to update without filters");
        await this.db.prepare(`UPDATE "${this.physicalTable()}" SET ${keys.map((key) => `"${key}" = ?`).join(", ")} WHERE ${this.filters.join(" AND ")}`)
          .bind(...keys.map((key) => row[key]), ...this.params).run();
        continue;
      }
      const keys = Object.keys(row);
      let sql = `INSERT ${this.ignoreDuplicates ? "OR IGNORE " : ""}INTO "${this.physicalTable()}" (${keys.map((key) => `"${key}"`).join(", ")}) VALUES (${keys.map(() => "?").join(", ")})`;
      if (this.mode === "upsert" && this.upsertKey) {
        const conflict = this.upsertKey.split(",").map((key) => key.trim()).filter(Boolean);
        const updates = keys.filter((key) => !conflict.includes(key));
        sql += updates.length
          ? ` ON CONFLICT (${conflict.map((key) => `"${key}"`).join(", ")}) DO UPDATE SET ${updates.map((key) => `"${key}" = excluded."${key}"`).join(", ")}`
          : ` ON CONFLICT (${conflict.map((key) => `"${key}"`).join(", ")}) DO NOTHING`;
      }
      await this.db.prepare(sql).bind(...keys.map((key) => row[key])).run();
    }
    return rows.map((row) => this.normalize(row));
  }
  async maybeSingle() { const rows = await this.selectRows(); return { data: rows[0] ?? null, error: null }; }
  async single() { const result = await this.maybeSingle(); return result.data ? result : { data: null, error: new Error("No row found") }; }
  then(onfulfilled?: ((value: { data: Row[] | null; error: QueryError | null; count: number | null }) => unknown) | null, onrejected?: ((reason: unknown) => unknown) | null) {
    return (async () => {
      try {
        if (this.mode !== "select") return { data: await this.writeRows(), error: null, count: null };
        if (this.countMode) {
          let sql = `SELECT COUNT(*) AS count FROM "${this.physicalTable()}"`;
          if (this.filters.length) sql += ` WHERE ${this.filters.join(" AND ")}`;
          const count = await this.db.prepare(sql).bind(...this.params).first<{ count: number }>();
          return { data: this.headOnly ? null : await this.selectRows(), error: null, count: count?.count ?? 0 };
        }
        return { data: await this.selectRows(), error: null, count: null };
      } catch (error) {
        return {
          data: null,
          error: error instanceof Error ? { message: error.message } : { message: String(error) },
          count: null,
        };
      }
    })().then(onfulfilled as never, onrejected as never);
  }
}

export function getD1(binding: "DB" = "DB") {
  const db = getDb(binding);
  return db ? { from(table: string) { return new D1Query(db, table); } } : null;
}
