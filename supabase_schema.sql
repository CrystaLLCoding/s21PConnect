-- ==========================================================
-- PeerConnect 21 — Supabase (PostgreSQL) Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==========================================================

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS public.users (
  telegram_id BIGINT PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  telegram_username TEXT DEFAULT '',
  anon_nick TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  interests TEXT DEFAULT '',
  campus TEXT DEFAULT 'Tashkent',
  level TEXT DEFAULT 'Common Core Lvl 4',
  avatar TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  project_id TEXT PRIMARY KEY,
  owner_nick TEXT NOT NULL REFERENCES public.users(anon_nick) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  needed_roles TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open',
  campus TEXT DEFAULT 'Tashkent',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  application_id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES public.projects(project_id) ON DELETE CASCADE,
  applicant_nick TEXT NOT NULL REFERENCES public.users(anon_nick) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  reject_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow public read & service/anon write access for PeerConnect 21 API
CREATE POLICY "Allow public read access to users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow anon insert/update to users" ON public.users FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow anon insert/update to projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read access to applications" ON public.applications FOR SELECT USING (true);
CREATE POLICY "Allow anon insert/update to applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);

-- 4. Initial Seed Data (Your active profile and project)
INSERT INTO public.users (
  telegram_id,
  full_name,
  phone_number,
  telegram_username,
  anon_nick,
  password_hash,
  skills,
  interests,
  campus,
  level,
  avatar
) VALUES (
  5019943928,
  'ICT',
  '+998998758647',
  'Shokhruxoke',
  'silent_core_73',
  '19892219',
  ARRAY['AI/ML', 'Algorithms'],
  'School 21 Tashkent campus startaplarida ishlash va jamoa tuzish',
  'Tashkent',
  'Common Core Lvl 4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=silent_core_73'
) ON CONFLICT (telegram_id) DO UPDATE 
SET anon_nick = EXCLUDED.anon_nick, password_hash = EXCLUDED.password_hash;

INSERT INTO public.projects (
  project_id,
  owner_nick,
  title,
  description,
  needed_roles,
  status,
  campus
) VALUES (
  'proj-1789242250903',
  'silent_core_73',
  'Application for Game',
  'Ios uchun platforma yaratish batafsil loyihaga qo''shilganingizda tushuntiriladi!',
  ARRAY['C Backend', 'Python', 'UI/UX'],
  'open',
  'Tashkent'
) ON CONFLICT (project_id) DO NOTHING;
