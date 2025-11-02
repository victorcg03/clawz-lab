-- Enable RLS and basic policies for audit_logs
alter table if exists public.audit_logs enable row level security;

-- Drop old policies if any
drop policy if exists audit_logs_insert_own on public.audit_logs;
drop policy if exists audit_logs_select_own on public.audit_logs;

-- Allow authenticated users to insert logs for themselves
create policy audit_logs_insert_own on public.audit_logs
  for insert to authenticated
  with check (
    actor_id = (select auth.uid())
  );

-- Allow authenticated users to read their own logs
create policy audit_logs_select_own on public.audit_logs
  for select to authenticated
  using (
    actor_id = (select auth.uid())
  );

-- Helpful index
create index if not exists idx_audit_logs_actor_created on public.audit_logs(actor_id, created_at desc);
