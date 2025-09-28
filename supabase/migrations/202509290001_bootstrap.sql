-- Migration: bootstrap domain schema
-- Tables
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  phone text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

create table if not exists size_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  left_thumb numeric, left_index numeric, left_middle numeric, left_ring numeric, left_pinky numeric,
  right_thumb numeric, right_index numeric, right_middle numeric, right_ring numeric, right_pinky numeric,
  created_at timestamptz default now()
);

create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_i18n jsonb not null,
  description_i18n jsonb,
  hero_image text,
  created_at timestamptz default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_i18n jsonb not null,
  description_i18n jsonb,
  base_price numeric not null check (base_price >= 0),
  active boolean default true,
  collection_id uuid references collections(id) on delete set null,
  created_at timestamptz default now()
);
create index on products(active);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
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
create index on product_variants(product_id);

create table if not exists carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  status text not null check (status in ('cart','abandoned','converted')),
  created_at timestamptz default now()
);
create index on carts(user_id);

create table if not exists cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid references carts(id) on delete cascade,
  variant_id uuid references product_variants(id),
  qty int not null check (qty > 0),
  size_profile_id uuid references size_profiles(id),
  custom_sizes jsonb,
  created_at timestamptz default now()
);
create index on cart_items(cart_id);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  status text not null check (status in ('placed','paid','in_production','shipped')),
  total numeric not null check (total >= 0),
  shipping_address jsonb,
  notes text,
  created_at timestamptz default now()
);
create index on orders(user_id);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  variant_id uuid references product_variants(id),
  qty int not null,
  unit_price numeric not null,
  size_profile_id uuid references size_profiles(id),
  custom_sizes jsonb,
  created_at timestamptz default now()
);
create index on order_items(order_id);

create table if not exists custom_requests (
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
  status text not null default 'pending_quote',
  created_at timestamptz default now()
);
create index on custom_requests(status);

create table if not exists custom_request_media (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references custom_requests(id) on delete cascade,
  file_url text not null,
  kind text,
  title text,
  created_at timestamptz default now()
);
create index on custom_request_media(request_id);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references custom_requests(id) on delete cascade,
  amount numeric not null check (amount >= 0),
  currency text not null default 'EUR',
  message text,
  expires_at timestamptz,
  status text not null default 'pending',
  created_at timestamptz default now()
);
create index on quotes(request_id);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  request_id uuid references custom_requests(id) on delete cascade,
  author text not null check (author in ('client','admin')),
  content text not null,
  created_at timestamptz default now()
);
create index on messages(request_id);

create table if not exists discounts (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  type text not null,
  value numeric not null,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean default true
);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  entity text not null,
  entity_id uuid not null,
  action text not null,
  actor_id uuid references auth.users(id) on delete set null,
  meta jsonb,
  created_at timestamptz default now()
);
create index on audit_logs(entity, entity_id);

-- RLS
alter table profiles enable row level security;
alter table size_profiles enable row level security;
alter table carts enable row level security;
alter table cart_items enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table custom_requests enable row level security;
alter table custom_request_media enable row level security;
alter table quotes enable row level security;
alter table messages enable row level security;

create policy "profiles_self" on profiles for select using (auth.uid() = id);
create policy "profiles_self_update" on profiles for update using (auth.uid() = id);

create policy "size_profiles_owner" on size_profiles for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "carts_owner" on carts for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "cart_items_cascade" on cart_items for all using (
  exists (select 1 from carts c where c.id = cart_items.cart_id and c.user_id = auth.uid())
) with check (
  exists (select 1 from carts c where c.id = cart_items.cart_id and c.user_id = auth.uid())
);

create policy "orders_owner" on orders for select using (auth.uid() = user_id);
create policy "order_items_owner" on order_items for select using (
  exists (select 1 from orders o where o.id = order_items.order_id and o.user_id = auth.uid())
);

create policy "custom_requests_owner_select" on custom_requests for select using (
  user_id is null or auth.uid() = user_id
);
create policy "custom_requests_insert" on custom_requests for insert with check (true);
create policy "custom_requests_owner_update" on custom_requests for update using (auth.uid() = user_id);

create policy "custom_request_media_select" on custom_request_media for select using (
  exists (select 1 from custom_requests r where r.id = custom_request_media.request_id and (r.user_id is null or r.user_id = auth.uid()))
);
create policy "custom_request_media_insert" on custom_request_media for insert with check (
  exists (select 1 from custom_requests r where r.id = custom_request_media.request_id and (r.user_id is null or r.user_id = auth.uid()))
);

create policy "quotes_owner" on quotes for select using (
  exists (select 1 from custom_requests r where r.id = quotes.request_id and (r.user_id = auth.uid()))
);

create policy "messages_owner" on messages for select using (
  exists (select 1 from custom_requests r where r.id = messages.request_id and (r.user_id = auth.uid()))
);
create policy "messages_insert" on messages for insert with check (
  exists (select 1 from custom_requests r where r.id = messages.request_id and (r.user_id = auth.uid()))
);

-- Admin bypass via SECURITY DEFINER functions could be added later; for ahora se manejará desde edge functions / service key (no en cliente).

-- Seeds
insert into collections (id, slug, name_i18n, description_i18n) values
  (gen_random_uuid(), 'classic', '{"es":"Clásica","en":"Classic"}', '{"es":"Colección base","en":"Base collection"}')
on conflict do nothing;
