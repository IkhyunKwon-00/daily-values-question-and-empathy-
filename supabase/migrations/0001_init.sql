-- ============================================================================
-- Daily Values Question and Empathy — MVP schema
-- Run this in the Supabase SQL editor (or via the Supabase CLI migrations).
-- ============================================================================

-- Extensions -----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Enums ----------------------------------------------------------------------
do $$ begin
  create type gender as enum ('male', 'female', 'other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_status as enum ('pending', 'warned', 'suspended', 'banned', 'dismissed');
exception when duplicate_object then null; end $$;

-- Profiles -------------------------------------------------------------------
-- One row per auth user. Only `gender` is public; age/etc. stay private (MVP).
create table if not exists profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  gender gender,
  age int check (age is null or (age >= 14 and age <= 120)),
  created_at timestamptz not null default now()
);

-- Questions ------------------------------------------------------------------
-- Exactly one question per publish_date is shown to everyone that day.
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  category text not null,
  publish_date date not null unique,
  created_at timestamptz not null default now()
);

-- Answers --------------------------------------------------------------------
-- One answer per (user, question). Length rule enforced at DB level too.
create table if not exists answers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  question_id uuid not null references questions (id) on delete cascade,
  content text not null check (char_length(trim(content)) between 100 and 500),
  created_at timestamptz not null default now(),
  unique (user_id, question_id)
);
create index if not exists answers_question_idx on answers (question_id, created_at desc);
create index if not exists answers_user_idx on answers (user_id, created_at desc);

-- Likes ----------------------------------------------------------------------
-- A like targets a specific answer (and its author). Total counts are never
-- exposed via the API; only "did the current user like it" and per-recipient
-- notifications are surfaced.
create table if not exists likes (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references profiles (id) on delete cascade,
  to_user_id uuid not null references profiles (id) on delete cascade,
  answer_id uuid not null references answers (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (from_user_id, answer_id),
  check (from_user_id <> to_user_id)
);
create index if not exists likes_to_user_idx on likes (to_user_id, created_at desc);

-- Reports --------------------------------------------------------------------
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references profiles (id) on delete cascade,
  target_user_id uuid not null references profiles (id) on delete cascade,
  answer_id uuid references answers (id) on delete set null,
  reason text not null,
  status report_status not null default 'pending',
  created_at timestamptz not null default now(),
  check (reporter_id <> target_user_id)
);

-- Blocks ---------------------------------------------------------------------
create table if not exists blocks (
  blocker_id uuid not null references profiles (id) on delete cascade,
  blocked_id uuid not null references profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (blocker_id, blocked_id),
  check (blocker_id <> blocked_id)
);

-- ============================================================================
-- Auto-create a profile row when a new auth user signs up.
-- ============================================================================
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, gender)
  values (
    new.id,
    (new.raw_user_meta_data ->> 'gender')::gender
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table questions enable row level security;
alter table answers enable row level security;
alter table likes enable row level security;
alter table reports enable row level security;
alter table blocks enable row level security;

-- Profiles: everyone can read the public columns; only owner can edit.
-- (Column-level privacy for age/etc. is enforced by never selecting them in
--  the app until a match exists. RLS keeps writes owner-only.)
drop policy if exists "profiles readable" on profiles;
create policy "profiles readable" on profiles
  for select using (true);

drop policy if exists "profiles self upsert" on profiles;
create policy "profiles self upsert" on profiles
  for insert with check (auth.uid() = id);

drop policy if exists "profiles self update" on profiles;
create policy "profiles self update" on profiles
  for update using (auth.uid() = id);

-- Questions: readable by any authenticated user.
drop policy if exists "questions readable" on questions;
create policy "questions readable" on questions
  for select using (auth.role() = 'authenticated');

-- Answers: authenticated users can read all; only owner can write/delete their own.
drop policy if exists "answers readable" on answers;
create policy "answers readable" on answers
  for select using (auth.role() = 'authenticated');

drop policy if exists "answers insert own" on answers;
create policy "answers insert own" on answers
  for insert with check (auth.uid() = user_id);

drop policy if exists "answers update own" on answers;
create policy "answers update own" on answers
  for update using (auth.uid() = user_id);

drop policy if exists "answers delete own" on answers;
create policy "answers delete own" on answers
  for delete using (auth.uid() = user_id);

-- Likes: a user can read likes they sent OR received (for notifications), and
-- create/delete only their own outgoing likes. No aggregate exposure.
drop policy if exists "likes readable involved" on likes;
create policy "likes readable involved" on likes
  for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);

drop policy if exists "likes insert own" on likes;
create policy "likes insert own" on likes
  for insert with check (auth.uid() = from_user_id);

drop policy if exists "likes delete own" on likes;
create policy "likes delete own" on likes
  for delete using (auth.uid() = from_user_id);

-- Reports: reporter can create and read their own reports.
drop policy if exists "reports insert own" on reports;
create policy "reports insert own" on reports
  for insert with check (auth.uid() = reporter_id);

drop policy if exists "reports read own" on reports;
create policy "reports read own" on reports
  for select using (auth.uid() = reporter_id);

-- Blocks: owner-managed.
drop policy if exists "blocks read own" on blocks;
create policy "blocks read own" on blocks
  for select using (auth.uid() = blocker_id);

drop policy if exists "blocks insert own" on blocks;
create policy "blocks insert own" on blocks
  for insert with check (auth.uid() = blocker_id);

drop policy if exists "blocks delete own" on blocks;
create policy "blocks delete own" on blocks
  for delete using (auth.uid() = blocker_id);
