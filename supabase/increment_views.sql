-- Run this once in the Supabase SQL editor
create or replace function increment_article_views(article_slug text)
returns void
language sql
security definer
as $$
  update public.articles
  set views = views + 1
  where slug = article_slug and status = 'published';
$$;
