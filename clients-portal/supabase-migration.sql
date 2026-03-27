-- Run this in your Supabase SQL editor (Dashboard → SQL Editor → New Query)

-- 1. Create site_settings table (stores one row with id=1)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id                        INTEGER PRIMARY KEY DEFAULT 1,
  contact_banner_enabled    BOOLEAN  NOT NULL DEFAULT FALSE,
  contact_email_primary     TEXT     NOT NULL DEFAULT 'Hello@rasaproductions.in',
  contact_email_secondary   TEXT     NOT NULL DEFAULT 'a.rajarathnareddychennai@gmail.com',
  contact_phone             TEXT     NOT NULL DEFAULT '9133777017',
  feature_audio_versions    BOOLEAN  NOT NULL DEFAULT TRUE,
  feature_feedback_panel    BOOLEAN  NOT NULL DEFAULT TRUE,
  feature_lyrics_submit     BOOLEAN  NOT NULL DEFAULT TRUE,
  feature_project_team      BOOLEAN  NOT NULL DEFAULT TRUE,
  feature_timeline          BOOLEAN  NOT NULL DEFAULT TRUE,
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure only one row ever exists
ALTER TABLE public.site_settings ADD CONSTRAINT site_settings_single_row
  CHECK (id = 1);

-- Insert the default row
INSERT INTO public.site_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- RLS: Allow admins (service_role / authenticated) to read and write
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow anyone who is authenticated to read settings (needed for homepage SSR)
CREATE POLICY "Anyone can read settings"
  ON public.site_settings FOR SELECT
  USING (TRUE);

-- Only service role (server-side admin) can update settings
CREATE POLICY "Admin can update settings"
  ON public.site_settings FOR ALL
  USING (auth.role() = 'authenticated');

-- 2. Add lyrics_locked column to projects table
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS lyrics_locked BOOLEAN NOT NULL DEFAULT FALSE;

-- 3. Create lyrics_submissions table (to store actual lyrics text)
CREATE TABLE IF NOT EXISTS public.lyrics_submissions (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  UUID         NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  client_id   UUID         NOT NULL,
  lyrics_text TEXT         NOT NULL,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.lyrics_submissions ENABLE ROW LEVEL SECURITY;

-- Clients can insert their own lyrics
CREATE POLICY "Clients can submit lyrics"
  ON public.lyrics_submissions FOR INSERT
  WITH CHECK (auth.uid() = client_id);

-- Clients can view their own
CREATE POLICY "Clients can view own lyrics"
  ON public.lyrics_submissions FOR SELECT
  USING (auth.uid() = client_id);

-- Admins (service role) can read all
CREATE POLICY "Admins can read all lyrics"
  ON public.lyrics_submissions FOR ALL
  USING (auth.role() = 'service_role');
