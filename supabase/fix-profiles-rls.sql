-- FIX: "infinite recursion detected in policy for relation profiles"
--
-- Cause: the profiles policies queried public.profiles inline. Evaluating a
-- policy ON profiles then re-evaluated the policy, forever. The role lookup must
-- happen in a SECURITY DEFINER function, which runs as the table owner and so is
-- not subject to the policy it is being used by.
--
-- Run this in the Supabase SQL editor. Safe to re-run.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('super_admin','admin')
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

-- Rebuild the profiles policies without any inline self-query.
drop policy if exists profiles_self  on public.profiles;
drop policy if exists profiles_super on public.profiles;

-- You can always read your own row. Admins can read every row.
create policy profiles_read on public.profiles
  for select using (auth.uid() = id or public.is_admin());

-- Only a super_admin may create or change role rows.
create policy profiles_write on public.profiles
  for all using (public.is_super_admin()) with check (public.is_super_admin());
