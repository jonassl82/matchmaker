-- Matchmaker schema. Paste into the Supabase SQL editor and run once.

create extension if not exists pgcrypto;

create table if not exists men (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  name text not null default '',
  age int,
  city text not null default '',
  ig text not null default '',
  linkedin text,
  description text not null default '',
  open_to text not null default '',
  places text[] not null default '{}',
  vibes text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending','active','paused','matched','removed')),
  last_confirmed_at timestamptz not null default now(),
  added_at timestamptz not null default now()
);

create table if not exists women (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text not null unique,
  age int,
  city text,
  ig text,
  age_min int not null default 35,
  age_max int not null default 55,
  liked_vibes text[] not null default '{}',
  regions text[] not null default '{}',
  status text not null default 'pending'
    check (status in ('pending','active','paused','removed')),
  joined_at timestamptz not null default now()
);

-- The ledger. One row per (man shown to woman). The unique constraint is what
-- guarantees "a woman sees a man once" at the database level.
create table if not exists impressions (
  id uuid primary key default gen_random_uuid(),
  man_id uuid not null references men(id) on delete cascade,
  woman_id uuid not null references women(id) on delete cascade,
  drop_week date not null,
  created_at timestamptz not null default now(),
  unique (man_id, woman_id)
);

create index if not exists idx_impressions_woman on impressions(woman_id);
create index if not exists idx_impressions_week on impressions(drop_week);
create index if not exists idx_men_status on men(status);
create index if not exists idx_women_status on women(status);

-- Lock the tables down. Everything is touched server-side with the service-role
-- key, which bypasses RLS. With RLS on and no policies, the public anon key can
-- read and write nothing.
alter table men enable row level security;
alter table women enable row level security;
alter table impressions enable row level security;
