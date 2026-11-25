CREATE TABLE IF NOT EXISTS techblog_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  meta_description TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS techblog_sections (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES techblog_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(category_id, slug)
);

CREATE TABLE IF NOT EXISTS techblog_tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS techblog_articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  dek TEXT,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  cover_url TEXT,
  cover_alt TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  author_id TEXT,
  category_id TEXT REFERENCES techblog_categories(id) ON DELETE SET NULL,
  section_id TEXT REFERENCES techblog_sections(id) ON DELETE SET NULL,
  content_type TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT NOT NULL DEFAULT '[]',
  reading_time INTEGER,
  views INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  breaking INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  published_at TEXT
);

CREATE TABLE IF NOT EXISTS techblog_article_tags (
  article_id TEXT NOT NULL REFERENCES techblog_articles(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES techblog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX IF NOT EXISTS techblog_articles_status_idx ON techblog_articles(status);
CREATE INDEX IF NOT EXISTS techblog_articles_slug_idx ON techblog_articles(slug);
CREATE INDEX IF NOT EXISTS techblog_articles_category_idx ON techblog_articles(category_id);
