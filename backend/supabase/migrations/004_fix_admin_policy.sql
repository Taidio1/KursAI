-- backend/supabase/migrations/004_fix_admin_policy.sql
-- Naprawa: rekurencja nieskończona w polityce "Admin profile select all"
-- Stara polityka odpytywała public.profiles z wnętrza polityki na public.profiles → 500

-- Usuń rekurencyjną politykę
drop policy if exists "Admin profile select all" on public.profiles;

-- Funkcja SECURITY DEFINER omija RLS podczas wykonania → brak rekurencji
create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = user_id and role = 'admin'
  );
$$;

-- Nowa polityka używa funkcji zamiast bezpośredniego zapytania
create policy "Admin profile select all" on public.profiles
  for select using (public.is_admin(auth.uid()));
