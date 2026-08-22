-- ============================================================================
-- Daily Values — 1:1 messages (쪽지)
-- Run after 0001_init.sql. A message is directed from one user to another.
-- Faces stay unknown; only gender is ever surfaced alongside a message.
-- ============================================================================

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  from_user_id uuid not null references profiles (id) on delete cascade,
  to_user_id uuid not null references profiles (id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 1000),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  check (from_user_id <> to_user_id)
);
create index if not exists messages_pair_idx on messages (from_user_id, to_user_id, created_at);
create index if not exists messages_to_idx on messages (to_user_id, created_at desc);

alter table messages enable row level security;

-- Only the two people in a conversation can read it.
drop policy if exists "messages readable involved" on messages;
create policy "messages readable involved" on messages
  for select using (auth.uid() = from_user_id or auth.uid() = to_user_id);

-- You can only send messages as yourself.
drop policy if exists "messages insert own" on messages;
create policy "messages insert own" on messages
  for insert with check (auth.uid() = from_user_id);

-- The recipient can mark received messages as read.
drop policy if exists "messages mark read" on messages;
create policy "messages mark read" on messages
  for update using (auth.uid() = to_user_id) with check (auth.uid() = to_user_id);
