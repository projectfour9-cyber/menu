-- Create menus table for history
create table if not exists public.menus (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  menu_data jsonb not null,
  client_name text,
  event_name text,
  guest_count text,
  event_date text
);

-- Enable RLS
alter table public.menus enable row level security;

-- Policies: Authenticated users can view and delete all menus
create policy "Authenticated users can view all menus"
  on public.menus for select
  to authenticated
  using (true);

create policy "Authenticated users can delete all menus"
  on public.menus for delete
  to authenticated
  using (true);

create policy "Authenticated users can insert menus"
  on public.menus for insert
  to authenticated
  with check (auth.uid() = user_id);
