-- ============================================================
-- Migration: application_leads v2
-- Curated Dating Events MVP — /man and /women landing pages
-- Replaces previous version. Run in Supabase SQL Editor.
-- ============================================================

-- Drop existing table if re-running (safe for dev environments)
-- Comment out in production and use ALTER TABLE instead
drop table if exists public.application_leads;

-- Drop custom enum if it exists
drop type if exists public.contact_method_enum;

-- ── Custom Enum ────────────────────────────────────────────────────────
create type public.contact_method_enum as enum ('whatsapp', 'email');

-- ── Table ──────────────────────────────────────────────────────────────
create table public.application_leads (
  id                uuid         primary key default gen_random_uuid(),
  created_at        timestamptz  not null default now(),

  -- Segment identity
  gender            text         not null check (gender in ('male', 'female', 'other')),

  -- Step 1: Plan Preference
  -- "¿Qué plan te va más?" → afterwork | dinner | social
  preferred_plan    text         not null check (preferred_plan in ('afterwork', 'dinner', 'social')),

  -- Step 2: Personality Type
  -- "¿Cómo eres en un plan nuevo?" → extrovert | situational | quiet
  personality_type  text         not null check (personality_type in ('extrovert', 'situational', 'quiet')),

  -- Step 3: Connection Goal (open-ended)
  -- "¿Con quién te gustaría conectar?" — free-text bio, max 400 chars
  connection_goal   text         not null,

  -- Step 4: Contact method + conditional contact fields
  -- Exactly one of (phone, email) must be non-null depending on contact_method
  contact_method    public.contact_method_enum not null,
  phone             text,          -- populated when contact_method = 'whatsapp'
  email             text,          -- populated when contact_method = 'email'

  -- Vibe fields (reserved for future enrichment / scoring layer)
  vibe_energy       text,          -- e.g. 'high' | 'medium' | 'low'
  vibe_style        text,          -- e.g. 'adventurous' | 'cosy' | 'intellectual'
  vibe_intention    text,          -- e.g. 'relationship' | 'social' | 'explore'

  -- Source tracking
  source            text         not null default 'landing_page',  -- 'landing_man' | 'landing_women'
  utm_source        text,
  utm_medium        text,
  utm_campaign      text,

  -- ── Constraints ──────────────────────────────────────────────────────
  -- Enforce: WhatsApp leads must have phone; Email leads must have email.
  constraint chk_whatsapp_has_phone
    check (contact_method <> 'whatsapp' or phone is not null),
  constraint chk_email_has_email
    check (contact_method <> 'email' or email is not null),
  -- Prevent a lead from storing both contact fields simultaneously
  constraint chk_single_contact_method
    check (not (phone is not null and email is not null))
);

-- ── Indexes ───────────────────────────────────────────────────────────
create index app_leads_gender_idx         on public.application_leads (gender);
create index app_leads_preferred_plan_idx on public.application_leads (preferred_plan);
create index app_leads_personality_idx    on public.application_leads (personality_type);
create index app_leads_contact_method_idx on public.application_leads (contact_method);
create index app_leads_created_idx        on public.application_leads (created_at desc);

-- ── Row Level Security ────────────────────────────────────────────────
alter table public.application_leads enable row level security;

-- Anon users (no login) can submit — required for landing page conversion
create policy "Anyone can submit an application lead"
  on public.application_leads
  for insert
  to anon
  with check (true);

-- Only authenticated users / service role can read leads
create policy "Only authenticated users can read application leads"
  on public.application_leads
  for select
  to authenticated
  using (true);
