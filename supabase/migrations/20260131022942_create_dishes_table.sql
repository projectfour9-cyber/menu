-- Create dishes table for Catering Menu Architect

create extension if not exists pgcrypto;

create table if not exists public.dishes (
  id uuid primary key default gen_random_uuid(),
  cuisine text not null,
  category text not null,
  name text not null,
  description text,
  "dietaryTags" text[] not null default '{}',
  "imageUrl" text,
  created_at timestamptz not null default now()
);

-- Optional but recommended for local/dev:
alter table public.dishes enable row level security;

create policy "public read dishes"
on public.dishes
for select
to anon
using (true);

create policy "public insert dishes"
on public.dishes
for insert
to anon
with check (true);
