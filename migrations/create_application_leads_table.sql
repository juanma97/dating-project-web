-- ============================================================
-- Migration: create application_leads table
-- For: Curated Dating Events MVP — /man and /women landing pages
-- ============================================================
-- Run this in your Supabase SQL Editor

create table if not exists public.application_leads (
  id            uuid primary key default gen_random_uuid(),

  -- Segment identity
  gender        text not null check (gender in ('male', 'female', 'other')),
  age           smallint not null check (age >= 18 and age <= 65),
  city          text,

  -- Step 1 — Intent
  intent        text not null,   -- 'relationship' | 'social' | 'explore'

  -- Step 3 — Preferences (gender-branched)
  -- Male: preferred_age_range  e.g. '25-35'
  -- Female: key_preference     e.g. 'safety' | 'small_group' | 'age_match' | 'shared_interests'
  preferred_age_range   text,
  key_preference        text,

  -- Step 4 — Commitment
  first_name    text not null,
  email         text not null,
  timeline      text not null check (timeline in ('this_month', 'next_month', 'exploring')),

  -- Auto-generated tag string for CRM segmentation
  -- e.g. 'Lead_Male_25 | Intent_Relationship | Pref_AgeRange_25-35 | Timeline_Hot'
  tags          text[],

  -- Source tracking
  source        text not null default 'landing_page', -- 'landing_man' | 'landing_women'
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,

  created_at    timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists app_leads_gender_idx    on public.application_leads (gender);
create index if not exists app_leads_intent_idx    on public.application_leads (intent);
create index if not exists app_leads_timeline_idx  on public.application_leads (timeline);
create index if not exists app_leads_created_idx   on public.application_leads (created_at desc);
create index if not exists app_leads_email_idx     on public.application_leads (email);

-- ── Row Level Security ─────────────────────────────────────────
alter table public.application_leads enable row level security;

-- Allow anonymous users (no login) to submit — critical for landing page conversion
create policy "Anyone can submit an application lead"
  on public.application_leads
  for insert
  to anon
  with check (true);

-- Only authenticated users (admin/service role) can read leads
create policy "Only authenticated users can read application leads"
  on public.application_leads
  for select
  to authenticated
  using (true);
