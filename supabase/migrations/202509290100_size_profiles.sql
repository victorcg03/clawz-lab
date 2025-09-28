-- Migration: size_profiles table with RLS
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

alter table public.size_profiles enable row level security;

create index if not exists idx_size_profiles_user_created_at on public.size_profiles(user_id, created_at desc);

-- Policies
create policy "size_profiles_select_own" on public.size_profiles
for select using (auth.uid() = user_id);

create policy "size_profiles_insert_own" on public.size_profiles
for insert with check (auth.uid() = user_id);

create policy "size_profiles_update_own" on public.size_profiles
for update using (auth.uid() = user_id);

create policy "size_profiles_delete_own" on public.size_profiles
for delete using (auth.uid() = user_id);
