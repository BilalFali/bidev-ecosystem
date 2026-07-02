-- Split purchase_url into two separate fields for ZIP and GitHub delivery
-- Run in Supabase SQL editor

alter table public.products
  add column if not exists purchase_url_zip    text,
  add column if not exists purchase_url_github text;

-- Migrate existing purchase_url to purchase_url_zip (non-destructive)
update public.products
  set purchase_url_zip = purchase_url
  where purchase_url is not null
    and purchase_url_zip is null;
