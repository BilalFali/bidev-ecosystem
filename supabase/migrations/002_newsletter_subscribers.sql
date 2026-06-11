-- Newsletter subscribers table
-- Run this in the Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email      text        NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now() NOT NULL,
  confirmed  boolean     DEFAULT false NOT NULL,
  source     text        DEFAULT 'website'
);

-- Index for fast lookups by email
CREATE INDEX IF NOT EXISTS newsletter_subscribers_email_idx ON public.newsletter_subscribers (email);

-- RLS: only service role can read/write (blocks all public access)
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow server-side inserts (service role bypasses RLS, but anon must be blocked)
CREATE POLICY "No public access" ON public.newsletter_subscribers
  FOR ALL
  TO anon
  USING (false);

-- Admin: to view subscribers, use the Supabase dashboard or service role key
