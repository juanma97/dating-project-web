-- ============================================================
-- Migration: create leads table for Premium Events smoke test
-- ============================================================
-- Run this in your Supabase SQL Editor

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  event_id    uuid not null,
  city        text,
  min_age     smallint,
  max_age     smallint,
  girls_price real,
  boys_price  real,
  user_email  text not null,
  user_age    smallint not null,
  user_gender text not null,          -- 'male' | 'female' | 'other'
  preferred_age_range text,           -- optional e.g. '25-35'
  created_at  timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists leads_event_id_idx on public.leads (event_id);
create index if not exists leads_created_at_idx on public.leads (created_at desc);

-- ── Row Level Security ────────────────────────────────────────
-- Enable RLS so only your service role can read leads,
-- but anyone (anon key) can INSERT (no login required).
alter table public.leads enable row level security;

-- Allow anonymous users to insert leads (smoke test — no login needed)
create policy "Anyone can submit a lead"
  on public.leads
  for insert
  to anon
  with check (true);

-- Only authenticated users / service role can read leads
create policy "Only authenticated users can read leads"
  on public.leads
  for select
  to authenticated
  using (true);
