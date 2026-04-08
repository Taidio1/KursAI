-- backend/supabase/migrations/002_user_roles.sql

-- Tabela profili z rolą użytkownika
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin', 'user')),
  created_at timestamptz not null default now()
);

-- Automatyczne tworzenie profilu przy rejestracji
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'user');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

-- Użytkownik może odczytać własny profil
create policy "Own profile select" on public.profiles
  for select using (auth.uid() = id);

-- Admin może odczytać wszystkie profile
create policy "Admin profile select all" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );
