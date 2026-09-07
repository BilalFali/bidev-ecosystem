-- ============================================================
-- BiDev Tech (tech.bidev.dev) — Supabase schema
-- This is a SEPARATE Supabase project from bidev.dev's own database.
-- Run this once, in this new project's SQL editor.
-- ============================================================

create extension if not exists "uuid-ossp";

-- ──────────────────────────────────────────────────────────────
-- Categories
-- ──────────────────────────────────────────────────────────────
create table public.techblog_categories (
  id                uuid        primary key default uuid_generate_v4(),
  name              text        not null unique,
  slug              text        not null unique,
  description       text,
  icon              text,
  sort_order        integer     not null default 0,
  seo_title         text,
  meta_description  text,
  active            boolean     not null default true,
  created_at        timestamptz not null default now()
);

create index techblog_categories_slug_idx   on public.techblog_categories (slug);
create index techblog_categories_active_idx on public.techblog_categories (active);

-- ──────────────────────────────────────────────────────────────
-- Tags
-- ──────────────────────────────────────────────────────────────
create table public.techblog_tags (
  id         uuid        primary key default uuid_generate_v4(),
  name       text        not null unique,
  slug       text        not null unique,
  created_at timestamptz not null default now()
);

-- ──────────────────────────────────────────────────────────────
-- Articles
-- ──────────────────────────────────────────────────────────────
create table public.techblog_articles (
  id              uuid        primary key default uuid_generate_v4(),
  title           text        not null,
  slug            text        not null unique,
  dek             text,                          -- one-sentence editorial summary shown under the headline
  content         text        not null default '',
  excerpt         text,                          -- used for cards/SEO when dek isn't set
  cover_url       text,
  cover_alt       text,
  status          text        not null default 'draft'
                  check (status in ('draft', 'published', 'archived')),
  author_id       uuid        references auth.users(id) on delete set null,
  category_id     uuid        references public.techblog_categories(id) on delete set null,
  seo_title       text,
  seo_description text,
  seo_keywords    text[]      not null default '{}',
  reading_time    integer,
  views           integer     not null default 0,
  featured        boolean     not null default false,
  breaking        boolean     not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  published_at    timestamptz
);

create index techblog_articles_status_idx    on public.techblog_articles (status);
create index techblog_articles_slug_idx      on public.techblog_articles (slug);
create index techblog_articles_category_idx  on public.techblog_articles (category_id);
create index techblog_articles_published_idx on public.techblog_articles (published_at desc)
  where status = 'published';

-- ──────────────────────────────────────────────────────────────
-- Article ↔ Tag join
-- ──────────────────────────────────────────────────────────────
create table public.techblog_article_tags (
  article_id uuid not null references public.techblog_articles(id) on delete cascade,
  tag_id     uuid not null references public.techblog_tags(id)     on delete cascade,
  primary key (article_id, tag_id)
);

-- ──────────────────────────────────────────────────────────────
-- articles_with_relations-equivalent view
-- ──────────────────────────────────────────────────────────────
create view public.techblog_articles_with_relations as
select
  a.*,
  c.name as category_name,
  c.slug as category_slug,
  coalesce(
    json_agg(
      json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
    ) filter (where t.id is not null),
    '[]'
  ) as tags
from public.techblog_articles a
left join public.techblog_categories c   on c.id = a.category_id
left join public.techblog_article_tags at on at.article_id = a.id
left join public.techblog_tags t          on t.id = at.tag_id
group by a.id, c.name, c.slug;

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

create trigger techblog_articles_updated_at
  before update on public.techblog_articles
  for each row execute function update_updated_at();

-- ──────────────────────────────────────────────────────────────
-- RLS — public read published/active, authenticated write
-- (The admin app actually writes via its service-role key, bypassing
-- RLS entirely — these policies are defense-in-depth, matching the
-- convention used across bidev.dev's own schema.)
-- ──────────────────────────────────────────────────────────────
alter table public.techblog_categories    enable row level security;
alter table public.techblog_tags          enable row level security;
alter table public.techblog_articles      enable row level security;
alter table public.techblog_article_tags  enable row level security;

create policy "public_read_techblog_categories" on public.techblog_categories
  for select using (active = true);
create policy "auth_write_techblog_categories" on public.techblog_categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public_read_techblog_tags" on public.techblog_tags
  for select using (true);
create policy "auth_write_techblog_tags" on public.techblog_tags
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public_read_techblog_articles" on public.techblog_articles
  for select using (status = 'published');
create policy "auth_write_techblog_articles" on public.techblog_articles
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "public_read_techblog_article_tags" on public.techblog_article_tags
  for select using (true);
create policy "auth_write_techblog_article_tags" on public.techblog_article_tags
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────────
-- Seed: real, evergreen categories only — no article rows seeded.
-- ──────────────────────────────────────────────────────────────
insert into public.techblog_categories (name, slug, description, icon, sort_order) values
  ('AI',                    'ai',            'AI news, tools, models, and the businesses building them.',    'brain-circuit', 1),
  ('Technology News',       'tech-news',     'The technology stories of the day.',                            'newspaper',     2),
  ('Smartphones',           'smartphones',   'Phones, mobile OS, and the apps that run on them.',             'smartphone',    3),
  ('Hardware & PCs',        'hardware',      'Laptops, PCs, GPUs, CPUs, and the devices we use daily.',       'cpu',           4),
  ('Data & Security',       'security',      'Cybersecurity, privacy, and how our data is handled.',          'shield',        5),
  ('Big Tech',              'bigtech',       'Apple, Google, Microsoft, Meta, NVIDIA, Amazon, and more.',     'building-2',    6),
  ('Startups',              'startups',      'New companies, funding, and the people building them.',         'rocket',        7),
  ('Apps & Internet',       'apps-internet', 'Apps, platforms, and how we use the internet.',                 'globe',         8),
  ('Gaming',                'gaming',        'Games, consoles, and the technology behind them.',              'gamepad-2',     9),
  ('Science & Future Tech', 'science',       'Emerging science and the technology of tomorrow.',              'flask-conical', 10);
