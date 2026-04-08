-- backend/supabase/migrations/001_initial.sql

-- Tabele treści kursu (publiczne do odczytu)
create table public.paths (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  has_dual_mode boolean not null default false
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  path_id uuid not null references public.paths(id) on delete cascade,
  title text not null,
  "order" int not null default 0
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  "order" int not null default 0
);

create table public.slides (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  mode text not null check (mode in ('single', 'technical', 'practical')),
  "order" int not null default 0,
  content_json jsonb not null,
  bot_comment text
);

-- Tabele użytkownika
create table public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  mode text not null,
  current_slide_order int not null default 0,
  completed_at timestamptz,
  unique(user_id, lesson_id, mode)
);

create table public.user_mode_locks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  chosen_mode text not null check (chosen_mode in ('technical', 'practical')),
  locked_at timestamptz not null default now(),
  unique(user_id, course_id)
);

-- RLS: włącz dla wszystkich tabel
alter table public.paths enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.slides enable row level security;
alter table public.user_progress enable row level security;
alter table public.user_mode_locks enable row level security;

-- Treści kursu: publiczny odczyt
create policy "Public read paths" on public.paths for select using (true);
create policy "Public read courses" on public.courses for select using (true);
create policy "Public read lessons" on public.lessons for select using (true);
create policy "Public read slides" on public.slides for select using (true);

-- Postęp użytkownika: tylko własne dane
create policy "Own progress select" on public.user_progress
  for select using (auth.uid() = user_id);
create policy "Own progress insert" on public.user_progress
  for insert with check (auth.uid() = user_id);
create policy "Own progress update" on public.user_progress
  for update using (auth.uid() = user_id);

-- Blokada trybu: tylko własne dane
create policy "Own locks select" on public.user_mode_locks
  for select using (auth.uid() = user_id);
create policy "Own locks insert" on public.user_mode_locks
  for insert with check (auth.uid() = user_id);

-- Seed: 3 ścieżki kursu
insert into public.paths (slug, title, has_dual_mode) values
  ('wspolna', 'Ścieżka Wspólna', false),
  ('no_code', 'Ścieżka A – No-Code', true),
  ('kod', 'Ścieżka B – Kod', true);
