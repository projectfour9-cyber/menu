-- Create sub_menu_items table
create table if not exists public.sub_menu_items (
  id uuid primary key default gen_random_uuid(),
  dish_id uuid references public.dishes(id) on delete cascade,
  name text not null,
  description text,
  "dietaryTags" text[] not null default '{}',
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table public.sub_menu_items enable row level security;

-- Policies: Public read for now (consistent with dishes)
create policy "public read sub_menu_items"
on public.sub_menu_items
for select
to anon, authenticated
using (true);

-- Authenticated users can insert/update/delete (consistent with dishes)
create policy "public insert sub_menu_items"
on public.sub_menu_items
for insert
to anon, authenticated
with check (true);

create policy "public update sub_menu_items"
on public.sub_menu_items
for update
to anon, authenticated
using (true);

create policy "public delete sub_menu_items"
on public.sub_menu_items
for delete
to anon, authenticated
using (true);
