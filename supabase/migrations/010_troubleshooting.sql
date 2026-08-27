-- Flutter Troubleshooting Hub
-- Reuses the existing `articles` table for content (same admin editor, same
-- /blog/[slug] URLs) via an `is_troubleshooting` flag + optional metadata
-- columns. Troubleshooting categories are a SEPARATE table from `categories`
-- because names overlap (Flutter, Firebase already exist as Learn categories)
-- and mixing them would blend general tutorials with troubleshooting content.
-- Paste entire file into Supabase SQL editor and run.

create table if not exists public.troubleshooting_categories (
  id                uuid        default gen_random_uuid() primary key,
  name              text        not null,
  slug              text        not null unique,
  description       text,
  icon              text,
  sort_order        integer     not null default 0,
  seo_title         text,
  meta_description  text,
  active            boolean     not null default true,
  created_at        timestamptz not null default now()
);

create index if not exists troubleshooting_categories_slug_idx   on public.troubleshooting_categories (slug);
create index if not exists troubleshooting_categories_active_idx on public.troubleshooting_categories (active);

alter table public.troubleshooting_categories enable row level security;

drop policy if exists "public_read_troubleshooting_categories" on public.troubleshooting_categories;
create policy "public_read_troubleshooting_categories" on public.troubleshooting_categories
  for select using (active = true);

drop policy if exists "auth_write_troubleshooting_categories" on public.troubleshooting_categories;
create policy "auth_write_troubleshooting_categories" on public.troubleshooting_categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Extend articles with optional troubleshooting metadata (all nullable —
-- zero effect on existing non-troubleshooting rows/queries)
alter table public.articles
  add column if not exists is_troubleshooting            boolean not null default false,
  add column if not exists troubleshooting_category_id   uuid references public.troubleshooting_categories(id) on delete set null,
  add column if not exists error_message                 text,
  add column if not exists problem                        text,
  add column if not exists symptoms                       text[],
  add column if not exists causes                         text[],
  add column if not exists quick_fix                      text,
  add column if not exists solutions                      jsonb,
  add column if not exists verification_steps             text[],
  add column if not exists common_mistakes                text[],
  add column if not exists affected_platforms             text[],
  add column if not exists technologies                   text[],
  add column if not exists difficulty                     text check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  add column if not exists related_problems               text[],
  add column if not exists related_guides                 text[];

create index if not exists articles_is_troubleshooting_idx        on public.articles (is_troubleshooting);
create index if not exists articles_troubleshooting_category_idx  on public.articles (troubleshooting_category_id);

-- Recreate the view to surface troubleshooting category name/slug alongside
-- the existing category name/slug (a.* already carries the new columns above).
-- Dropped and recreated (not CREATE OR REPLACE) because the new `articles`
-- columns shift where category_name/category_slug land in `a.*`'s output,
-- which Postgres's REPLACE disallows (it only permits appending columns).
drop view if exists public.articles_with_relations;

create view public.articles_with_relations as
select
  a.*,
  c.name        as category_name,
  c.slug        as category_slug,
  tc.name       as troubleshooting_category_name,
  tc.slug       as troubleshooting_category_slug,
  coalesce(
    json_agg(
      json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
    ) filter (where t.id is not null),
    '[]'
  ) as tags
from public.articles a
left join public.categories c                  on c.id = a.category_id
left join public.troubleshooting_categories tc on tc.id = a.troubleshooting_category_id
left join public.article_tags at               on at.article_id = a.id
left join public.tags t                        on t.id = at.tag_id
group by a.id, c.name, c.slug, tc.name, tc.slug;
