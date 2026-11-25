CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT,
  cover_url TEXT,
  cover_alt TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  author_id TEXT,
  category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT NOT NULL DEFAULT '[]',
  reading_time INTEGER,
  views INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  published_at TEXT,
  is_troubleshooting INTEGER NOT NULL DEFAULT 0,
  troubleshooting_category_id TEXT,
  error_message TEXT,
  problem TEXT,
  symptoms TEXT NOT NULL DEFAULT '[]',
  causes TEXT NOT NULL DEFAULT '[]',
  quick_fix TEXT,
  solutions TEXT NOT NULL DEFAULT '[]',
  verification_steps TEXT NOT NULL DEFAULT '[]',
  common_mistakes TEXT NOT NULL DEFAULT '[]',
  affected_platforms TEXT NOT NULL DEFAULT '[]',
  technologies TEXT NOT NULL DEFAULT '[]',
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  related_problems TEXT NOT NULL DEFAULT '[]',
  related_guides TEXT NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS article_tags (
  article_id TEXT NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id TEXT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE TABLE IF NOT EXISTS troubleshooting_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  seo_title TEXT,
  meta_description TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS media (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL,
  bucket TEXT NOT NULL DEFAULT 'media',
  size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  alt TEXT,
  width INTEGER,
  height INTEGER,
  uploaded_by TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  article_slug TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  content TEXT NOT NULL,
  approved INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT OR IGNORE INTO site_settings (key, value) VALUES ('auto_approve_comments', 'true');

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  is_active INTEGER NOT NULL DEFAULT 1,
  subscribed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS ai_worker_runs (
  id TEXT PRIMARY KEY,
  keyword TEXT NOT NULL,
  article_id TEXT REFERENCES articles(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'processing',
  error TEXT,
  sheet_row INTEGER,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  company TEXT NOT NULL,
  company_logo_url TEXT,
  location TEXT,
  remote TEXT NOT NULL DEFAULT 'onsite',
  employment_type TEXT NOT NULL DEFAULT 'full-time',
  category TEXT NOT NULL DEFAULT 'Flutter Development',
  salary_min INTEGER,
  salary_max INTEGER,
  salary_currency TEXT DEFAULT 'USD',
  description TEXT NOT NULL DEFAULT '',
  apply_url TEXT,
  apply_email TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  posted_at TEXT,
  expires_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  cover_url TEXT,
  price REAL NOT NULL DEFAULT 0,
  original_price REAL,
  price_github REAL,
  purchase_url TEXT,
  purchase_url_zip TEXT,
  purchase_url_github TEXT,
  badge TEXT,
  tags TEXT NOT NULL DEFAULT '[]',
  features TEXT NOT NULL DEFAULT '[]',
  whats_included TEXT NOT NULL DEFAULT '[]',
  requirements TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS product_images (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS product_faqs (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  product_id TEXT NOT NULL REFERENCES products(id),
  delivery_type TEXT NOT NULL,
  amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  github_username TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS github_access_requests (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  customer_email TEXT NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id),
  product_title TEXT NOT NULL DEFAULT '',
  github_username TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  invited_at TEXT,
  granted_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY,
  page_type TEXT NOT NULL,
  page_slug TEXT NOT NULL,
  page_title TEXT NOT NULL DEFAULT '',
  views INTEGER NOT NULL DEFAULT 0,
  last_viewed_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  UNIQUE(page_type, page_slug)
);

CREATE TABLE IF NOT EXISTS interview_questions (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  question TEXT NOT NULL,
  category TEXT NOT NULL,
  tags TEXT NOT NULL DEFAULT '[]',
  difficulty TEXT NOT NULL,
  short_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  code_language TEXT,
  code_example TEXT,
  common_mistakes TEXT NOT NULL DEFAULT '[]',
  interview_tips TEXT NOT NULL DEFAULT '[]',
  related_slugs TEXT NOT NULL DEFAULT '[]',
  related_article_slugs TEXT NOT NULL DEFAULT '[]',
  related_tool_slugs TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'published',
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS articles_status_idx ON articles(status);
CREATE INDEX IF NOT EXISTS articles_slug_idx ON articles(slug);
CREATE INDEX IF NOT EXISTS articles_category_idx ON articles(category_id);
CREATE INDEX IF NOT EXISTS articles_troubleshooting_idx ON articles(is_troubleshooting);
CREATE INDEX IF NOT EXISTS comments_slug_idx ON comments(article_slug, approved, created_at);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs(status, posted_at);
CREATE INDEX IF NOT EXISTS products_status_idx ON products(status);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS interview_status_idx ON interview_questions(status);
CREATE INDEX IF NOT EXISTS page_views_lookup_idx ON page_views(page_type, page_slug);
