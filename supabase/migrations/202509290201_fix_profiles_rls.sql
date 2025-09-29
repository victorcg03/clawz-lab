-- Migration: Fix profiles RLS policy - add INSERT policy
-- The profiles table was missing an INSERT policy, preventing profile creation during registration

-- Add INSERT policy for profiles table
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);