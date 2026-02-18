-- IGNIZ MUN · Supabase schema
-- Run this in Supabase SQL Editor.

-- (1) UUID generator
create extension if not exists "pgcrypto";

-- (2) Delegates table
create table if not exists public.delegates (
  id uuid primary key default gen_random_uuid(),
  reg_id text,
  source_timestamp text,

  round text default 'Main',

  full_name text,
  whatsapp text,
  email text unique,

  college text,
  course text,
  category text default 'Delegate',
  ca_code text,

  mun_experience text,
  accommodation text,

  pass_tier text,

  preferences jsonb not null default '{}'::jsonb,

  allotted_committee text,
  allotted_portfolio text,
  status text default 'Registered',
  allotted_at timestamptz,

  email_status text,
  email_sent_at timestamptz,
  email_error text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- (3) updated_at trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_delegates_updated_at on public.delegates;
create trigger trg_delegates_updated_at
before update on public.delegates
for each row
execute function public.set_updated_at();

-- (4) Helpful indexes
create index if not exists idx_delegates_status on public.delegates (status);
create index if not exists idx_delegates_round on public.delegates (round);
create index if not exists idx_delegates_pass_tier on public.delegates (pass_tier);
create index if not exists idx_delegates_created_at on public.delegates (created_at desc);

-- NOTE:
-- This repo uses the Supabase *service role key* on the server.
-- Keep the dashboard private (no auth included).
