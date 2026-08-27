-- Sarathi One — schema, roles and row-level security.
-- Paste into the Supabase SQL editor (Dashboard → SQL Editor → New query → Run).
--
-- SAFETY NOTE: every row here is SYNTHETIC demo data. Never load real citizen
-- records, real Aadhaar/PAN, or real phone numbers into this database.

-- ─────────────────────────── vehicles ───────────────────────────
create table if not exists public.vehicles (
  reg_no            text primary key,
  maker             text not null,
  model             text not null,
  year              int  not null,
  vehicle_class     text not null,
  fuel              text not null check (fuel in ('PETROL','DIESEL','CNG','ELECTRIC')),
  emission          text not null,
  color             text not null,
  rto               text not null,
  reg_date          date not null,
  chassis_masked    text not null,
  engine_masked     text not null,
  status            text not null default 'ACTIVE' check (status in ('ACTIVE','BLACKLISTED','SCRAPPED')),
  hypo_active       boolean not null default false,
  hypo_financier    text,
  hypo_since        date,
  hypo_form35_pending boolean not null default false,
  insurer           text,
  insurance_till    date,
  puc_till          date,
  tax_till          date,
  fitness_till      date,
  accident_flag     boolean not null default false,
  accident_note     text,
  fair_price_min    int not null default 0,
  fair_price_max    int not null default 0,
  odometer_km       int not null default 0,
  created_at        timestamptz not null default now()
);

create table if not exists public.owners (
  id          uuid primary key default gen_random_uuid(),
  reg_no      text not null references public.vehicles(reg_no) on delete cascade,
  serial      int  not null,
  name        text not null,
  masked_name text not null,
  from_date   date not null,
  to_date     date,
  unique (reg_no, serial)
);

create table if not exists public.challans (
  id      text primary key,
  reg_no  text not null references public.vehicles(reg_no) on delete cascade,
  date    date not null,
  offense text not null,
  amount  int  not null default 0,
  status  text not null check (status in ('PAID','PENDING','DISPUTED'))
);

-- ─────────────── citizen-generated records (demo journeys) ───────────────
create table if not exists public.applications (
  id            text primary key,
  mobile        text not null,          -- synthetic demo mobile, not a real number
  type          text not null,
  reg_no        text not null,
  stages        jsonb not null,
  current_stage int not null default 0,
  slot_rto      text,
  slot_date     date,
  slot_time     text,
  created_at    timestamptz not null default now()
);

create table if not exists public.payments (
  id         uuid primary key default gen_random_uuid(),
  receipt_no text not null,
  mobile     text not null,
  purpose    text not null,
  reg_no     text,
  amount     int  not null,
  status     text not null default 'SUCCESS',
  created_at timestamptz not null default now()
);

-- ─────────────────────────── admin roles ───────────────────────────
-- Mirrors auth.users. A row here is what makes someone an admin; being able to
-- sign in is NOT enough on its own.
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  role       text not null default 'viewer' check (role in ('super_admin','admin','viewer')),
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER is load-bearing: these run as the table owner, so a policy
-- that calls them does not re-enter the policy it is evaluating. An inline
-- subquery over profiles here causes "infinite recursion detected in policy".
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

-- ─────────────────────────── row-level security ───────────────────────────
alter table public.vehicles     enable row level security;
alter table public.owners       enable row level security;
alter table public.challans     enable row level security;
alter table public.applications enable row level security;
alter table public.payments     enable row level security;
alter table public.profiles     enable row level security;

-- Reference data is world-readable: this is the public vehicle record the whole
-- demo is about. Writes are admin-only.
drop policy if exists vehicles_read on public.vehicles;
create policy vehicles_read  on public.vehicles     for select using (true);
drop policy if exists owners_read on public.owners;
create policy owners_read    on public.owners       for select using (true);
drop policy if exists challans_read on public.challans;
create policy challans_read  on public.challans     for select using (true);

drop policy if exists vehicles_write on public.vehicles;
create policy vehicles_write on public.vehicles     for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists owners_write on public.owners;
create policy owners_write   on public.owners       for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists challans_write on public.challans;
create policy challans_write on public.challans     for all using (public.is_admin()) with check (public.is_admin());

-- Citizen journey records: only admins may read them through the anon key.
-- The citizen's own copy lives in their browser; the server writes here with the
-- service-role key, which bypasses RLS by design.
drop policy if exists applications_admin on public.applications;
create policy applications_admin on public.applications for all using (public.is_admin()) with check (public.is_admin());
drop policy if exists payments_admin on public.payments;
create policy payments_admin     on public.payments     for all using (public.is_admin()) with check (public.is_admin());

-- You may read your own profile; only a super_admin may change roles.
drop policy if exists profiles_self  on public.profiles;
drop policy if exists profiles_read  on public.profiles;
drop policy if exists profiles_super on public.profiles;
drop policy if exists profiles_write on public.profiles;
create policy profiles_read  on public.profiles for select using (auth.uid() = id or public.is_admin());
create policy profiles_write on public.profiles for all
  using (public.is_super_admin()) with check (public.is_super_admin());

-- ─────────────────────────── grant an admin ───────────────────────────
-- 1. Dashboard → Authentication → Users → "Add user" (email + password).
-- 2. Run this with that email to promote them:
--
-- insert into public.profiles (id, email, role)
-- select id, email, 'super_admin' from auth.users where email = 'you@example.com'
-- on conflict (id) do update set role = 'super_admin';
