-- Restrict profile visibility to admins or the owner
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;

create policy "Profiles are viewable by admin or owner." on public.profiles
  for select using (
    auth.uid() = id
    or exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
