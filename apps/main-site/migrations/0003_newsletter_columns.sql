ALTER TABLE newsletter_subscribers ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;
ALTER TABLE newsletter_subscribers ADD COLUMN subscribed_at TEXT;
ALTER TABLE newsletter_subscribers ADD COLUMN updated_at TEXT;
