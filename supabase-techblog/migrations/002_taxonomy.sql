-- ============================================================
-- BiDev Tech — Taxonomy correction (Categories / Sections / Content Type)
-- Per .claude/skills/tech-blog-design/TAXONOMY.md
--
-- Safe to run: zero articles and zero tags exist in this project yet
-- (verified before writing this migration), so there is nothing to
-- migrate and no URL ever referenced the categories being removed below.
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- 1. Sections (new table) — sub-topic inside a category, per TAXONOMY §3
-- ──────────────────────────────────────────────────────────────
create table if not exists public.techblog_sections (
  id          uuid        primary key default uuid_generate_v4(),
  category_id uuid        not null references public.techblog_categories(id) on delete cascade,
  name        text        not null,
  slug        text        not null,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  unique (category_id, slug)
);

create index if not exists techblog_sections_category_idx on public.techblog_sections (category_id);

alter table public.techblog_sections enable row level security;

create policy "public_read_techblog_sections" on public.techblog_sections
  for select using (true);
create policy "auth_write_techblog_sections" on public.techblog_sections
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ──────────────────────────────────────────────────────────────
-- 2. Content Type — the format facet, per TAXONOMY §4 (independent of Category)
-- ──────────────────────────────────────────────────────────────
alter table public.techblog_articles
  add column if not exists section_id uuid references public.techblog_sections(id) on delete set null,
  add column if not exists content_type text check (content_type in (
    'news', 'analysis', 'explainer', 'how-it-works', 'guide', 'buying-guide',
    'review', 'comparison', 'data-story', 'report', 'deep-dive', 'opinion',
    'timeline', 'interview'
  ));

create index if not exists techblog_articles_section_idx      on public.techblog_articles (section_id);
create index if not exists techblog_articles_content_type_idx on public.techblog_articles (content_type);

-- ──────────────────────────────────────────────────────────────
-- 3. Correct the category set to TAXONOMY §2/§13's final ten.
--    (AI, Big Tech, Gaming keep their existing id/slug; the rest are
--    replaced — safe, since 0 articles reference any category today.)
-- ──────────────────────────────────────────────────────────────
delete from public.techblog_categories
  where slug in ('tech-news', 'smartphones', 'startups', 'apps-internet', 'security');

update public.techblog_categories set name = 'Hardware',              sort_order = 3  where slug = 'hardware';
update public.techblog_categories set name = 'Big Tech',              sort_order = 7  where slug = 'bigtech';
update public.techblog_categories set name = 'Gaming',                sort_order = 9  where slug = 'gaming';
update public.techblog_categories set name = 'AI',                    sort_order = 1  where slug = 'ai';
update public.techblog_categories set name = 'Future Tech & Science', slug = 'future-tech-science', sort_order = 10
  where slug = 'science';

insert into public.techblog_categories (name, slug, description, icon, sort_order) values
  ('Mobile',   'mobile',   'Smartphones, wearables, and mobile OS.',                          'smartphone',   2),
  ('Data',     'data',     'Market data, statistics, and trackers.',                          'bar-chart-3',  4),
  ('Security', 'security', 'Cybersecurity and privacy.',                                      'shield',       5),
  ('Software', 'software', 'Apps, operating systems, the internet, and cloud computing.',      'layers',       6),
  ('Business', 'business', 'Startups, funding, venture capital, and industry trends.',         'briefcase',    8)
on conflict (slug) do nothing;

-- ──────────────────────────────────────────────────────────────
-- 4. Sections seed, per TAXONOMY §3
-- ──────────────────────────────────────────────────────────────
insert into public.techblog_sections (category_id, name, slug, sort_order)
select c.id, v.name, v.slug, v.sort_order
from (values
  ('ai', 'AI Models',            'ai-models',            1),
  ('ai', 'AI Tools',              'ai-tools',              2),
  ('ai', 'AI Agents',             'ai-agents',             3),
  ('ai', 'Generative AI',         'generative-ai',         4),
  ('ai', 'AI Coding',             'ai-coding',             5),
  ('ai', 'AI Research',           'ai-research',           6),

  ('mobile', 'Smartphones',        'smartphones',          1),
  ('mobile', 'Wearables',          'wearables',            2),
  ('mobile', 'Mobile OS',          'mobile-os',            3),
  ('mobile', 'Mobile Accessories', 'mobile-accessories',   4),

  ('hardware', 'Laptops & PCs',           'laptops-pcs',           1),
  ('hardware', 'Components',              'components',            2),
  ('hardware', 'Monitors & Peripherals',  'monitors-peripherals',  3),
  ('hardware', 'Networking Hardware',     'networking-hardware',   4),

  ('software', 'Apps',                'apps',                1),
  ('software', 'Operating Systems',   'operating-systems',   2),
  ('software', 'Internet & Web',      'internet-web',        3),
  ('software', 'Cloud Computing',     'cloud-computing',     4),
  ('software', 'Open Source',         'open-source',         5),

  ('bigtech', 'Company Strategy',       'company-strategy',       1),
  ('bigtech', 'Earnings & Business',    'earnings-business',      2),
  ('bigtech', 'Regulation & Antitrust', 'regulation-antitrust',   3),
  ('bigtech', 'Leadership & Culture',   'leadership-culture',     4),

  ('data', 'Market Trackers',         'market-trackers',         1),
  ('data', 'Industry Reports',        'industry-reports',        2),
  ('data', 'Surveys & Adoption Data', 'surveys-adoption-data',   3),

  ('security', 'Breaches & Vulnerabilities', 'breaches-vulnerabilities', 1),
  ('security', 'Privacy',                    'privacy',                 2),
  ('security', 'Enterprise Security',        'enterprise-security',     3),
  ('security', 'Consumer Security',          'consumer-security',       4),

  ('business', 'Startups & Funding', 'startups-funding', 1),
  ('business', 'Venture Capital',    'venture-capital',   2),
  ('business', 'IPOs & M&A',         'ipos-ma',           3),
  ('business', 'Industry & Jobs',    'industry-jobs',     4),

  ('gaming', 'Console Gaming',         'console-gaming',         1),
  ('gaming', 'PC Gaming',              'pc-gaming',              2),
  ('gaming', 'Mobile Gaming',          'mobile-gaming',          3),
  ('gaming', 'Game Industry Business', 'game-industry-business', 4),
  ('gaming', 'Esports',                'esports',                5),

  ('future-tech-science', 'Robotics',              'robotics',              1),
  ('future-tech-science', 'Space Tech',             'space-tech',            2),
  ('future-tech-science', 'Quantum Computing',      'quantum-computing',     3),
  ('future-tech-science', 'Biotech & Health Tech',  'biotech-health-tech',   4),
  ('future-tech-science', 'Climate Tech',           'climate-tech',          5)
) as v(category_slug, name, slug, sort_order)
join public.techblog_categories c on c.slug = v.category_slug
on conflict (category_id, slug) do nothing;

-- ──────────────────────────────────────────────────────────────
-- 5. Rebuild the relations view to surface section + content_type
-- ──────────────────────────────────────────────────────────────
drop view if exists public.techblog_articles_with_relations;

create view public.techblog_articles_with_relations as
select
  a.*,
  c.name as category_name,
  c.slug as category_slug,
  s.name as section_name,
  s.slug as section_slug,
  coalesce(
    json_agg(
      json_build_object('id', t.id, 'name', t.name, 'slug', t.slug)
    ) filter (where t.id is not null),
    '[]'
  ) as tags
from public.techblog_articles a
left join public.techblog_categories c    on c.id = a.category_id
left join public.techblog_sections s      on s.id = a.section_id
left join public.techblog_article_tags at on at.article_id = a.id
left join public.techblog_tags t          on t.id = at.tag_id
group by a.id, c.name, c.slug, s.name, s.slug;
