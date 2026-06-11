-- Comments + site_settings tables
-- Paste entire file into Supabase SQL editor and run

-- ── 1. Comments ───────────────────────────────────────────────────────────
DROP TABLE IF EXISTS public.comments CASCADE;

CREATE TABLE public.comments (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug text        NOT NULL,
  author_name  text        NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 80),
  author_email text,
  content      text        NOT NULL CHECK (char_length(content) BETWEEN 2 AND 2000),
  approved     boolean     DEFAULT true NOT NULL,   -- auto-approved by default
  created_at   timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX comments_slug_approved_idx
  ON public.comments (article_slug, approved, created_at DESC);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Block public access" ON public.comments
  FOR ALL TO anon USING (false);

-- ── 2. Site settings ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  key   text PRIMARY KEY,
  value text NOT NULL
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Block public access" ON public.site_settings
  FOR ALL TO anon USING (false);

-- Default: auto-approve comments = true
INSERT INTO public.site_settings (key, value)
  VALUES ('auto_approve_comments', 'true')
  ON CONFLICT (key) DO NOTHING;
