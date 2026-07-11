-- Nabd HR Admin — Supabase schema + RLS
-- Run in Supabase SQL Editor (or as migration).

-- NOTE:
-- - Assumes auth.users is used by Supabase Auth.
-- - Role values are: 'admin' | 'employee'
-- - RLS: employees can only see their own rows; admins can see all.

-- Create schema helpers
create schema if not exists public;

-- 1) users
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text unique not null,
  role text not null check (role in ('admin','employee')),
  department text,
  employee_number text unique
);

-- 2) pulse_questions
create table if not exists public.pulse_questions (
  id bigserial primary key,
  question_key text unique not null,
  question_text text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 3) pulse_responses
create table if not exists public.pulse_responses (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  pulse_question_id bigint not null references public.pulse_questions(id) on delete restrict,
  response_text text,
  response_value integer,
  created_at timestamptz not null default now(),
  unique(user_id, pulse_question_id, created_at)
);

-- 4) points_ledger
create table if not exists public.points_ledger (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  points_delta integer not null,
  reason text,
  created_at timestamptz not null default now()
);

-- 5) rewards + user_rewards
create table if not exists public.rewards (
  id bigserial primary key,
  title text not null,
  description text,
  points_cost integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.user_rewards (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  reward_id bigint not null references public.rewards(id) on delete cascade,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique(user_id, reward_id)
);

-- 6) yoga_sessions + session_attendance
create table if not exists public.yoga_sessions (
  id bigserial primary key,
  title text not null,
  mode text,
  coach text,
  starts_at timestamptz not null,
  capacity integer not null default 1,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.session_attendance (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  session_id bigint not null references public.yoga_sessions(id) on delete cascade,
  status text not null default 'registered',
  created_at timestamptz not null default now(),
  unique(user_id, session_id)
);

-- 7) employee_uploads
create table if not exists public.employee_uploads (
  id bigserial primary key,
  uploader_id uuid not null references public.users(id) on delete cascade,
  storage_path text not null,
  original_file_name text not null,
  mime_type text,
  row_count integer,
  created_at timestamptz not null default now(),
  status text not null default 'processing' check (status in ('processing','completed','failed')),
  summary jsonb not null default '{}'::jsonb
);

-- 8) notifications + critical_alerts
create table if not exists public.notifications (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  type text not null,
  title text not null,
  body text,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.critical_alerts (
  id bigserial primary key,
  user_id uuid not null references public.users(id) on delete cascade,
  level text not null default 'non_blocking',
  message text not null,
  is_resolved boolean not null default false,
  created_at timestamptz not null default now()
);

-- =======================
-- RLS + Policies
-- =======================

-- Enable RLS
alter table public.users enable row level security;
alter table public.pulse_questions enable row level security;
alter table public.pulse_responses enable row level security;
alter table public.points_ledger enable row level security;
alter table public.rewards enable row level security;
alter table public.user_rewards enable row level security;
alter table public.yoga_sessions enable row level security;
alter table public.session_attendance enable row level security;
alter table public.employee_uploads enable row level security;
alter table public.notifications enable row level security;
alter table public.critical_alerts enable row level security;

-- Helper: current user role
-- Using auth.uid() -> public.users.id
-- If user row doesn't exist yet, policies deny.

-- users
create policy "users_select_own_or_admin"
on public.users for select
using (
  exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
  or id = auth.uid()
);

create policy "users_update_own_or_admin"
on public.users for update
using (
  exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
  or id = auth.uid()
)
with check (
  exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
  or id = auth.uid()
);

-- pulse_questions: employees can read active; admins can read all
create policy "pulse_questions_select_active_or_admin"
on public.pulse_questions for select
using (
  is_active = true
  or exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

-- pulse_responses: employees only own; admins all
create policy "pulse_responses_select_own_or_admin"
on public.pulse_responses for select
using (
  user_id = auth.uid()
  or exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

create policy "pulse_responses_insert_own"
on public.pulse_responses for insert
with check (user_id = auth.uid());

create policy "pulse_responses_delete_own_or_admin"
on public.pulse_responses for delete
using (
  user_id = auth.uid()
  or exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

-- points_ledger: employees only own; admins all
create policy "points_ledger_select_own_or_admin"
on public.points_ledger for select
using (
  user_id = auth.uid()
  or exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

create policy "points_ledger_insert_own"
on public.points_ledger for insert
with check (user_id = auth.uid());

-- rewards: readable for employees; admins manage
create policy "rewards_select_all"
on public.rewards for select
using (true);

-- user_rewards: employees only own; admins all
create policy "user_rewards_select_own_or_admin"
on public.user_rewards for select
using (
  user_id = auth.uid()
  or exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

create policy "user_rewards_insert_own"
on public.user_rewards for insert
with check (user_id = auth.uid());

-- yoga_sessions: employees can read active sessions; admins all
create policy "yoga_sessions_select_active_or_admin"
on public.yoga_sessions for select
using (
  is_active = true
  or exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

-- session_attendance: employees own; admins all
create policy "session_attendance_select_own_or_admin"
on public.session_attendance for select
using (
  user_id = auth.uid()
  or exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

create policy "session_attendance_insert_own"
on public.session_attendance for insert
with check (user_id = auth.uid());

-- employee_uploads: admins only (recommended)
create policy "employee_uploads_admin_only"
on public.employee_uploads for select
using (
  exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

create policy "employee_uploads_admin_insert"
on public.employee_uploads for insert
with check (
  exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

-- notifications: employees own; admins all
create policy "notifications_select_own_or_admin"
on public.notifications for select
using (
  user_id = auth.uid()
  or exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

create policy "notifications_insert_admin"
on public.notifications for insert
with check (
  exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
  or user_id = auth.uid()
);

-- critical_alerts: employees only own alerts; admins all
create policy "critical_alerts_select_own_or_admin"
on public.critical_alerts for select
using (
  user_id = auth.uid()
  or exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
);

create policy "critical_alerts_insert_admin"
on public.critical_alerts for insert
with check (
  exists (select 1 from public.users u2 where u2.id = auth.uid() and u2.role = 'admin')
  or user_id = auth.uid()
);

