-- Full reset migration: drops and recreates the entire public domain schema for Clawz Lab
-- Safe to run multiple times; uses IF EXISTS/IF NOT EXISTS guards and idempotent seeds
-- Includes: extensions, tables, RLS, policies, trigger for profiles, indexes, views, and seeds

begin;

-- 0) Extensions
create extension if not exists "pgcrypto";

-- 1) Drop dependent objects first
drop view if exists public.products_with_collection;

-- Trigger and function for profile auto-creation
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2) Drop tables (children before parents)
drop table if exists public.order_items cascade;
drop table if exists public.cart_items cascade;
drop table if exists public.product_variants cascade;
drop table if exists public.quotes cascade;
drop table if exists public.messages cascade;
drop table if exists public.custom_request_media cascade;
drop table if exists public.orders cascade;
drop table if exists public.carts cascade;
drop table if exists public.custom_requests cascade;
drop table if exists public.products cascade;
drop table if exists public.collections cascade;
drop table if exists public.size_profiles cascade;
drop table if exists public.discounts cascade;
drop table if exists public.audit_logs cascade;
drop table if exists public.profiles cascade;
drop table if exists public.constants cascade;

-- 3) Recreate tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.size_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  left_thumb numeric(4,1),
  left_index numeric(4,1),
  left_middle numeric(4,1),
  left_ring numeric(4,1),
  left_pinky numeric(4,1),
  right_thumb numeric(4,1),
  right_index numeric(4,1),
  right_middle numeric(4,1),
  right_ring numeric(4,1),
  right_pinky numeric(4,1),
  created_at timestamptz not null default now()
);

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_i18n jsonb not null,
  description_i18n jsonb,
  image_url text,
  hero_image text,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_i18n jsonb not null,
  description_i18n jsonb,
  base_price numeric not null check (base_price >= 0),
  active boolean default true,
  image_url text,
  collection_id uuid references public.collections(id) on delete set null,
  created_at timestamptz default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  shape text,
  length text,
  finish text,
  colorway text,
  sku text unique,
  price numeric check (price >= 0),
  stock int default 0,
  images jsonb default '[]'::jsonb,
  active boolean default true
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  status text not null check (status in ('cart','abandoned','converted')),
  created_at timestamptz default now()
);

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references public.carts(id) on delete cascade,
  variant_id uuid references public.product_variants(id),
  qty int not null check (qty > 0),
  size_profile_id uuid references public.size_profiles(id),
  custom_sizes jsonb,
  created_at timestamptz default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  status text not null check (status in ('placed','paid','in_production','shipped')),
  total numeric not null check (total >= 0),
  shipping_address jsonb,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete cascade,
  variant_id uuid references public.product_variants(id),
  qty int not null check (qty > 0),
  unit_price numeric not null check (unit_price >= 0),
  size_profile_id uuid references public.size_profiles(id),
  custom_sizes jsonb,
  created_at timestamptz default now()
);

create table if not exists public.custom_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  contact_name text not null,
  email text not null,
  phone text,
  shape text,
  length text,
  colors jsonb,
  finish text,
  theme text,
  extras jsonb,
  target_date date,
  brief text,
  measurement jsonb,
  status text not null default 'pending_quote' check (status in ('pending_quote','quoted','accepted','rejected','in_production','ready','shipped')),
  created_at timestamptz default now()
);

create table if not exists public.custom_request_media (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.custom_requests(id) on delete cascade,
  file_url text not null,
  kind text,
  title text,
  created_at timestamptz default now()
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.custom_requests(id) on delete cascade,
  amount numeric not null check (amount >= 0),
  currency text not null default 'EUR',
  message text,
  expires_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references public.custom_requests(id) on delete cascade,
  author text not null check (author in ('client','admin')),
  content text not null,
  created_at timestamptz default now()
);

create table if not exists public.discounts (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null,
  value numeric not null,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean default true
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  entity text not null,
  entity_id uuid not null,
  action text not null,
  actor_id uuid references auth.users(id) on delete set null,
  meta jsonb,
  created_at timestamptz default now()
);

create table if not exists public.constants (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz default now()
);

-- 4) RLS enablement
alter table public.profiles enable row level security;
alter table public.size_profiles enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.custom_requests enable row level security;
alter table public.custom_request_media enable row level security;
alter table public.quotes enable row level security;
alter table public.messages enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles
drop policy if exists "profiles_self" on public.profiles;
create policy "profiles_self" on public.profiles
  for select to anon, authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles_self_update" on public.profiles;
create policy "profiles_self_update" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()));

drop policy if exists "profiles_insert" on public.profiles;
create policy "profiles_insert" on public.profiles
  for insert to authenticated
  with check (id = (select auth.uid()));

-- Size profiles (single ALL policy)
drop policy if exists "size_profiles_all_operations" on public.size_profiles;
create policy "size_profiles_all_operations" on public.size_profiles
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

-- Carts
drop policy if exists "carts_owner" on public.carts;
create policy "carts_owner" on public.carts
  for all to authenticated
  using (user_id = (select auth.uid()));

-- Cart items via cart
drop policy if exists "cart_items_cascade" on public.cart_items;
create policy "cart_items_cascade" on public.cart_items
  for all to authenticated
  using (
    exists (
      select 1 from public.carts c
      where c.id = cart_items.cart_id and c.user_id = (select auth.uid())
    )
  );

-- Orders
drop policy if exists "orders_owner" on public.orders;
create policy "orders_owner" on public.orders
  for all to authenticated
  using (user_id = (select auth.uid()));

-- Order items via order
drop policy if exists "order_items_owner" on public.order_items;
create policy "order_items_owner" on public.order_items
  for all to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.user_id = (select auth.uid())
    )
  );

-- Custom requests
drop policy if exists "custom_requests_owner" on public.custom_requests;
create policy "custom_requests_owner" on public.custom_requests
  for all to authenticated
  using (user_id = (select auth.uid()));

-- Custom request media
drop policy if exists "custom_request_media_owner" on public.custom_request_media;
create policy "custom_request_media_owner" on public.custom_request_media
  for all to authenticated
  using (
    exists (
      select 1 from public.custom_requests r
      where r.id = custom_request_media.request_id and r.user_id = (select auth.uid())
    )
  );

-- Quotes
drop policy if exists "quotes_owner" on public.quotes;
create policy "quotes_owner" on public.quotes
  for all to authenticated
  using (
    exists (
      select 1 from public.custom_requests r
      where r.id = quotes.request_id and r.user_id = (select auth.uid())
    )
  );

-- Messages
drop policy if exists "messages_owner" on public.messages;
create policy "messages_owner" on public.messages
  for all to authenticated
  using (
    exists (
      select 1 from public.custom_requests r
      where r.id = messages.request_id and r.user_id = (select auth.uid())
    )
  );

-- Audit logs RLS: authenticated users can insert and read their own entries
drop policy if exists audit_logs_insert_own on public.audit_logs;
drop policy if exists audit_logs_select_own on public.audit_logs;
create policy audit_logs_insert_own on public.audit_logs
  for insert to authenticated
  with check (
    actor_id = (select auth.uid())
  );
create policy audit_logs_select_own on public.audit_logs
  for select to authenticated
  using (
    actor_id = (select auth.uid())
  );

-- 6) Trigger to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 7) Indexes
-- Basic FKs and common access paths
create index if not exists idx_products_active_created on public.products(active, created_at desc) where active = true;
create index if not exists idx_products_collection_id on public.products(collection_id);
create index if not exists idx_product_variants_product_id on public.product_variants(product_id);

create index if not exists idx_carts_user on public.carts(user_id);
create index if not exists idx_cart_items_cart_id on public.cart_items(cart_id);
create index if not exists idx_cart_items_variant_id on public.cart_items(variant_id);
create index if not exists idx_cart_items_cart_variant on public.cart_items(cart_id, variant_id);

create index if not exists idx_orders_user_id on public.orders(user_id);
create index if not exists idx_order_items_order_id on public.order_items(order_id);
create index if not exists idx_order_items_variant_id on public.order_items(variant_id);
create index if not exists idx_order_items_order_variant on public.order_items(order_id, variant_id);

create index if not exists idx_custom_requests_user on public.custom_requests(user_id);
create index if not exists idx_custom_requests_user_status on public.custom_requests(user_id, status);
create index if not exists idx_custom_requests_user_recent on public.custom_requests(user_id, created_at desc) where user_id is not null;

create index if not exists idx_custom_request_media_request_id on public.custom_request_media(request_id);
create index if not exists idx_quotes_request_id on public.quotes(request_id);
create index if not exists idx_messages_request_id on public.messages(request_id);

create index if not exists idx_audit_logs_entity on public.audit_logs(entity, entity_id);
create index if not exists idx_audit_logs_actor_id on public.audit_logs(actor_id);
create index if not exists idx_audit_logs_actor_created on public.audit_logs(actor_id, created_at desc);

create index if not exists idx_size_profiles_user_id on public.size_profiles(user_id);

-- 8) View
create or replace view public.products_with_collection as
select
  p.id,
  p.slug,
  p.name_i18n,
  p.description_i18n,
  p.base_price,
  p.active,
  p.image_url,
  p.created_at,
  jsonb_build_object(
    'slug', c.slug,
    'name_i18n', c.name_i18n
  ) as collection
from public.products p
left join public.collections c on c.id = p.collection_id;

-- 9) Seeds
insert into public.collections (id, slug, name_i18n, description_i18n, image_url, hero_image)
values
  (gen_random_uuid(), 'classic', '{"es":"Clásicos","en":"Classics"}'::jsonb, '{"es":"Colección clásica","en":"Classic collection"}'::jsonb, null, null),
  (gen_random_uuid(), 'trendy', '{"es":"Tendencias","en":"Trendy"}'::jsonb, '{"es":"Al día con las tendencias","en":"On trend"}'::jsonb, null, null)
on conflict (slug) do nothing;

with cls as (
  select id, slug from public.collections where slug in ('classic','trendy')
),
prod as (
  select (select id from cls where slug='classic') as classic_id,
         (select id from cls where slug='trendy') as trendy_id
)
insert into public.products (id, slug, name_i18n, description_i18n, base_price, active, collection_id)
select gen_random_uuid(), 'rose-metal', '{"es":"Rosa Metalizado","en":"Rose Metallic"}'::jsonb, '{"es":"Acabado metálico rosa","en":"Rose metallic finish"}'::jsonb, 29.99, true, p.classic_id from prod p
union all
select gen_random_uuid(), 'black-matte', '{"es":"Negro Mate","en":"Black Matte"}'::jsonb, '{"es":"Elegancia mate","en":"Matte elegance"}'::jsonb, 24.99, true, p.trendy_id from prod p
on conflict (slug) do nothing;

insert into public.constants(key, value)
values
  ('nail_lengths', '["short","medium","long"]'::jsonb),
  ('nail_shapes_all', '["square","almond","ballerina","stiletto"]'::jsonb),
  ('allowed_shapes_by_length', '{"short":["square","almond","ballerina"],"medium":["square","almond","ballerina","stiletto"],"long":["square","almond","ballerina","stiletto"]}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

-- 10) Dev helper: make first profile admin if none exists
update public.profiles 
set is_admin = true 
where id = (
  select id 
  from public.profiles 
  order by created_at asc 
  limit 1
)
and not exists (
  select 1 from public.profiles where is_admin = true
);

commit;
