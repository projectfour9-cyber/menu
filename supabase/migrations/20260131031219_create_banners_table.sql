-- supabase/migrations/<timestamp>_create_banners_table.sql

create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  cuisine text not null unique,
  image_url text not null,
  alt text,
  created_at timestamptz not null default now()
);

alter table public.banners enable row level security;

-- Allow reads for everyone (anon + authenticated)
drop policy if exists "read banners anon" on public.banners;
create policy "read banners anon"
on public.banners
for select
to anon
using (true);

drop policy if exists "read banners authenticated" on public.banners;
create policy "read banners authenticated"
on public.banners
for select
to authenticated
using (true);

-- OPTIONAL: allow inserts in dev (lock down later)
drop policy if exists "insert banners authenticated" on public.banners;
create policy "insert banners authenticated"
on public.banners
for insert
to authenticated
with check (true);
