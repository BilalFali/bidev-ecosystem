-- ============================================================
-- bidev admin CMS — Supabase schema
-- Run this in the Supabase SQL editor
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- Categories
-- ──────────────────────────────────────────────────────────────
create table public.categories (
  id          uuid        primary key default uuid_generate_v4(),
  name        text        not null unique,
  slug        text        not null unique,
  description text,
  created_at  timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────
-- Tags
-- ──────────────────────────────────────────────────────────────
create table public.tags (
  id         uuid        primary key default uuid_generate_v4(),
  name       text        not null unique,
  slug       text        not null unique,
  created_at timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────
-- Articles
-- ──────────────────────────────────────────────────────────────
create table public.articles (
  id              uuid        primary key default uuid_generate_v4(),
  title           text        not null,
  slug            text        not null unique,
  content         text        not null default '',
  excerpt         text,
  cover_url       text,
  cover_alt       text,
  status          text        not null default 'draft'
                  check (status in ('draft', 'published', 'archived')),
  author_id       uuid        not null references auth.users(id) on delete cascade,
  category_id     uuid        references public.categories(id) on delete set null,
  seo_title       text,
  seo_description text,
  seo_keywords    text[]      default '{}',
  reading_time    integer,
  views           integer     not null default 0,
  featured        boolean     not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  published_at    timestamptz
);

create index articles_status_idx    on public.articles(status);
create index articles_slug_idx      on public.articles(slug);
create index articles_author_idx    on public.articles(author_id);
create index articles_category_idx  on public.articles(category_id);
create index articles_published_idx on public.articles(published_at desc)
  where status = 'published';

-- ──────────────────────────────────────────────────────────────
-- Article ↔ Tag join
-- ──────────────────────────────────────────────────────────────
create table public.article_tags (
  article_id uuid not null references public.articles(id) on delete cascade,
  tag_id     uuid not null references public.tags(id)     on delete cascade,
  primary key (article_id, tag_id)
);

-- ──────────────────────────────────────────────────────────────
-- Media
-- ──────────────────────────────────────────────────────────────
create table public.media (
  id            uuid        primary key default uuid_generate_v4(),
  filename      text        not null,
  original_name text        not null,
  url           text        not null,
  bucket        text        not null default 'media',
  size          integer     not null,
  mime_type     text        not null,
  alt           text,
  width         integer,
  height        integer,
  uploaded_by   uuid        not null references auth.users(id) on delete cascade,
  created_at    timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────
-- Auto-update updated_at
-- ──────────────────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger articles_updated_at
  before update on public.articles
  for each row execute function update_updated_at();

-- ──────────────────────────────────────────────────────────────
-- Row-Level Security
-- All tables locked to authenticated users (admin-only app)
-- ──────────────────────────────────────────────────────────────
alter table public.articles     enable row level security;
alter table public.categories   enable row level security;
alter table public.tags         enable row level security;
alter table public.article_tags enable row level security;
alter table public.media        enable row level security;

-- articles
create policy "auth_full_articles" on public.articles
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- categories
create policy "auth_full_categories" on public.categories
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- tags
create policy "auth_full_tags" on public.tags
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- article_tags
create policy "auth_full_article_tags" on public.article_tags
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- media
create policy "auth_full_media" on public.media
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────────
-- Storage buckets
-- Create these manually in the Supabase dashboard or via CLI:
--
--   supabase storage create covers --public
--   supabase storage create media  --public
--
-- Then add policies:
-- ──────────────────────────────────────────────────────────────

-- After creating buckets, run these storage policies:
-- (Supabase storage policies are managed separately in the dashboard)

-- ──────────────────────────────────────────────────────────────
-- Helpful view: articles with tag names and category name
-- ──────────────────────────────────────────────────────────────
create or replace view public.articles_with_relations as
select
  a.*,
  c.name        as category_name,
  c.slug        as category_slug,
  coalesce(
    json_agg(
      json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
    ) filter (where t.id is not null),
    '[]'
  ) as tags
from public.articles a
left join public.categories c    on c.id = a.category_id
left join public.article_tags at on at.article_id = a.id
left join public.tags t          on t.id = at.tag_id
group by a.id, c.name, c.slug;
