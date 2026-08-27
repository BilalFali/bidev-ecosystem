-- Interview Questions module: DB-backed Flutter interview Q&A content
-- Category/difficulty taxonomy stays static in code (INTERVIEW_CATEGORIES, DIFFICULTIES) —
-- only the question rows move here.
-- Paste entire file into Supabase SQL editor and run

create table if not exists public.interview_questions (
  id                    uuid        default gen_random_uuid() primary key,
  slug                  text        not null unique,
  question              text        not null,
  category              text        not null,
  tags                  text[]      not null default '{}',
  difficulty            text        not null
                        check (difficulty in ('Beginner', 'Intermediate', 'Advanced')),
  short_answer          text        not null,
  explanation           text        not null,
  code_language         text,
  code_example          text,
  common_mistakes       text[]      not null default '{}',
  interview_tips        text[]      not null default '{}',
  related_slugs         text[]      not null default '{}',
  related_article_slugs text[]      not null default '{}',
  related_tool_slugs    text[]      not null default '{}',
  status                text        not null default 'published'
                        check (status in ('draft', 'published')),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists interview_questions_slug_idx     on public.interview_questions (slug);
create index if not exists interview_questions_category_idx on public.interview_questions (category);
create index if not exists interview_questions_status_idx   on public.interview_questions (status);

alter table public.interview_questions enable row level security;

drop policy if exists "public_read_interview_questions" on public.interview_questions;
create policy "public_read_interview_questions" on public.interview_questions
  for select using (status = 'published');

drop policy if exists "auth_write_interview_questions" on public.interview_questions;
create policy "auth_write_interview_questions" on public.interview_questions
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop trigger if exists interview_questions_updated_at on public.interview_questions;
create trigger interview_questions_updated_at
  before update on public.interview_questions
  for each row execute function update_updated_at();
