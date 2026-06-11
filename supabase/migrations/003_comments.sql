-- Comments table
-- Run this in the Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.comments (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  article_slug text        NOT NULL,
  author_name  text        NOT NULL CHECK (char_length(author_name) BETWEEN 1 AND 80),
  author_email text,
  content      text        NOT NULL CHECK (char_length(content) BETWEEN 2 AND 2000),
  approved     boolean     DEFAULT false NOT NULL,
  created_at   timestamptz DEFAULT now() NOT NULL
);

-- Fast lookups: all comments for an article (admin), approved comments (public)
CREATE INDEX IF NOT EXISTS comments_slug_approved_idx
  ON public.comments (article_slug, approved, created_at DESC);

-- RLS: block all direct anon access — every read/write goes through service-role API routes
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Block public access" ON public.comments
  FOR ALL TO anon USING (false);

-- Service role bypasses RLS, so the API routes have full access.
