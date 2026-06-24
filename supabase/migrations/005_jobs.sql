-- Jobs board: admin-curated job listings
-- Paste entire file into Supabase SQL editor and run

create table if not exists public.jobs (
  id                uuid        default gen_random_uuid() primary key,
  title             text        not null,
  slug              text        not null unique,
  company           text        not null,
  company_logo_url  text,
  location          text,
  remote            text        not null default 'onsite'
                    check (remote in ('remote', 'hybrid', 'onsite')),
  employment_type   text        not null default 'full-time'
                    check (employment_type in ('full-time', 'part-time', 'contract', 'internship')),
  category          text        not null default 'Flutter Development',
  salary_min        integer,
  salary_max        integer,
  salary_currency   text        default 'USD',
  description       text        not null default '',
  apply_url         text,
  apply_email       text,
  status            text        not null default 'draft'
                    check (status in ('draft', 'published', 'closed')),
  posted_at         timestamptz,
  expires_at        timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint jobs_apply_method_required check (apply_url is not null or apply_email is not null)
);

create index if not exists jobs_status_posted_idx on public.jobs (status, posted_at desc);

alter table public.jobs enable row level security;

drop policy if exists "auth_full_jobs" on public.jobs;
create policy "auth_full_jobs" on public.jobs
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop trigger if exists jobs_updated_at on public.jobs;
create trigger jobs_updated_at
  before update on public.jobs
  for each row execute function update_updated_at();
