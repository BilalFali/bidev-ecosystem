-- AI worker run log
-- Tracks each article generation attempt for debugging and auditing

CREATE TABLE IF NOT EXISTS public.ai_worker_runs (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword     text        NOT NULL,
  article_id  uuid        REFERENCES public.articles (id) ON DELETE SET NULL,
  status      text        NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'processed', 'error')),
  error       text,
  sheet_row   int,
  created_at  timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS ai_worker_runs_status_idx ON public.ai_worker_runs (status, created_at DESC);

ALTER TABLE public.ai_worker_runs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Block public access" ON public.ai_worker_runs;
CREATE POLICY "Block public access" ON public.ai_worker_runs FOR ALL TO anon USING (false);
