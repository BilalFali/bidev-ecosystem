-- Products module: Flutter starter kits, UI kits, ebooks
-- Paste entire file into Supabase SQL editor and run

-- Products
create table if not exists public.products (
  id                uuid          default gen_random_uuid() primary key,
  title             text          not null,
  slug              text          not null unique,
  short_description text          not null default '',
  description       text          not null default '',
  category          text          not null
                    check (category in ('flutter-starter-kit', 'ui-kit', 'ebook')),
  cover_url         text,
  price             numeric(10,2) not null default 0,
  original_price    numeric(10,2),
  price_github      numeric(10,2),
  purchase_url      text,
  badge             text          check (badge in ('new', 'bestseller', 'updated')),
  tags              text[]        not null default '{}',
  features          text[]        not null default '{}',
  whats_included    text[]        not null default '{}',
  requirements      text[]        not null default '{}',
  status            text          not null default 'draft'
                    check (status in ('draft', 'published')),
  sort_order        integer       not null default 0,
  created_at        timestamptz   not null default now(),
  updated_at        timestamptz   not null default now()
);

create index if not exists products_status_idx    on public.products (status);
create index if not exists products_category_idx  on public.products (category);
create index if not exists products_sort_idx      on public.products (sort_order, created_at desc);

alter table public.products enable row level security;

drop policy if exists "public_read_products"  on public.products;
create policy "public_read_products" on public.products
  for select using (status = 'published');

drop policy if exists "auth_write_products" on public.products;
create policy "auth_write_products" on public.products
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Gallery images
create table if not exists public.product_images (
  id          uuid        default gen_random_uuid() primary key,
  product_id  uuid        not null references public.products(id) on delete cascade,
  url         text        not null,
  alt         text,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.product_images enable row level security;

drop policy if exists "public_read_product_images" on public.product_images;
create policy "public_read_product_images" on public.product_images
  for select using (true);

drop policy if exists "auth_write_product_images" on public.product_images;
create policy "auth_write_product_images" on public.product_images
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- FAQs
create table if not exists public.product_faqs (
  id          uuid    default gen_random_uuid() primary key,
  product_id  uuid    not null references public.products(id) on delete cascade,
  question    text    not null,
  answer      text    not null,
  sort_order  integer not null default 0
);

alter table public.product_faqs enable row level security;

drop policy if exists "public_read_product_faqs" on public.product_faqs;
create policy "public_read_product_faqs" on public.product_faqs
  for select using (true);

drop policy if exists "auth_write_product_faqs" on public.product_faqs;
create policy "auth_write_product_faqs" on public.product_faqs
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Orders
create table if not exists public.orders (
  id              uuid          default gen_random_uuid() primary key,
  customer_email  text          not null,
  customer_name   text,
  product_id      uuid          not null references public.products(id),
  delivery_type   text          not null check (delivery_type in ('zip', 'github', 'pdf')),
  amount          numeric(10,2) not null,
  status          text          not null default 'pending'
                  check (status in ('pending', 'completed', 'refunded')),
  github_username text,
  created_at      timestamptz   not null default now(),
  updated_at      timestamptz   not null default now()
);

create index if not exists orders_email_idx  on public.orders (customer_email);
create index if not exists orders_status_idx on public.orders (status);

alter table public.orders enable row level security;

drop policy if exists "auth_full_orders" on public.orders;
create policy "auth_full_orders" on public.orders
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- GitHub access requests
create table if not exists public.github_access_requests (
  id              uuid        default gen_random_uuid() primary key,
  order_id        uuid        not null references public.orders(id),
  customer_email  text        not null,
  product_id      uuid        not null references public.products(id),
  product_title   text        not null default '',
  github_username text        not null,
  status          text        not null default 'pending'
                  check (status in ('pending', 'invited', 'granted')),
  invited_at      timestamptz,
  granted_at      timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.github_access_requests enable row level security;

drop policy if exists "auth_full_github_access" on public.github_access_requests;
create policy "auth_full_github_access" on public.github_access_requests
  for all using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Triggers (reuse existing update_updated_at function)
drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at
  before update on public.products
  for each row execute function update_updated_at();

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function update_updated_at();

drop trigger if exists github_access_requests_updated_at on public.github_access_requests;
create trigger github_access_requests_updated_at
  before update on public.github_access_requests
  for each row execute function update_updated_at();
