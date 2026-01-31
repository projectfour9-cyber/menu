-- Allow authenticated users to read + insert dishes (RLS is enabled)

-- Read policy for authenticated users
drop policy if exists "authenticated read dishes" on public.dishes;
create policy "authenticated read dishes"
on public.dishes
for select
to authenticated
using (true);

-- Insert policy for authenticated users
drop policy if exists "authenticated insert dishes" on public.dishes;
create policy "authenticated insert dishes"
on public.dishes
for insert
to authenticated
with check (true);
