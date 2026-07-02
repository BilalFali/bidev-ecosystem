-- Unified page view tracking for all content types
create table if not exists public.page_views (
  id             uuid primary key default gen_random_uuid(),
  page_type      text not null,  -- 'article' | 'product' | 'tool' | 'snippet' | 'page'
  page_slug      text not null,
  page_title     text not null default '',
  views          bigint not null default 0,
  last_viewed_at timestamptz not null default now(),
  created_at     timestamptz not null default now()
);

create unique index if not exists page_views_type_slug_idx
  on public.page_views (page_type, page_slug);

alter table public.page_views enable row level security;

-- Public can read (for potential public counters)
create policy "public read page_views"
  on public.page_views for select using (true);

-- Anyone can insert/update view counts (write done via security definer function)
create policy "public can track page views"
  on public.page_views for all using (true) with check (true);

-- Atomic upsert + increment (security definer to bypass RLS safely)
create or replace function public.upsert_page_view(
  p_type  text,
  p_slug  text,
  p_title text default ''
) returns void language plpgsql security definer as $$
begin
  insert into public.page_views (page_type, page_slug, page_title, views, last_viewed_at)
  values (p_type, p_slug, p_title, 1, now())
  on conflict (page_type, page_slug) do update
    set views          = page_views.views + 1,
        last_viewed_at = now(),
        page_title     = case
          when excluded.page_title <> '' then excluded.page_title
          else page_views.page_title
        end;
end;
$$;
