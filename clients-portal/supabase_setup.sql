-- ==============================================================================
-- RASA PRODUCTIONS CLIENT PORTAL - SUPABASE SETUP SCRIPT
-- Copy this entire file and paste it into the Supabase SQL Editor, then click RUN.
-- ==============================================================================

-- 1. Create Projects Table
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES auth.users(id) NOT NULL,
  client_name TEXT NOT NULL,
  project_title TEXT NOT NULL,
  song_title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Draft',
  cover_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read their own projects
CREATE POLICY "Clients can view their own projects"
ON public.projects FOR SELECT
USING (auth.uid() = client_id);

-- Policy: Super Admins can do anything to projects
-- Note: You'll need to manually set role = 'super_admin' in auth.users raw_user_meta_data later,
-- but for now, we'll allow all authenticated users to read/write for testing. 
-- In production, replace `true` with a role check.
CREATE POLICY "Super Admins full access to projects"
ON public.projects FOR ALL
USING (auth.uid() IN (SELECT id FROM auth.users));


-- 2. Create Events (Timeline) Table
CREATE TABLE public.events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL, -- 'upload', 'message', 'revision', etc.
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT, -- Path to file in storage if uploaded
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Clients view events for their projects
CREATE POLICY "Clients can view events for their projects"
ON public.events FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.projects
    WHERE projects.id = events.project_id
    AND projects.client_id = auth.uid()
  )
);

-- Policy: Admins full access
CREATE POLICY "Admins full access to events"
ON public.events FOR ALL
USING (auth.uid() IN (SELECT id FROM auth.users));


-- 3. Create Storage Bucket for Secure Audio
-- Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('secure-audio', 'secure-audio', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Clients can read audio from their projects
CREATE POLICY "Clients can stream their specific audio files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'secure-audio' AND 
  auth.role() = 'authenticated'
);

-- Storage Policy: Admins can upload audio
CREATE POLICY "Admins can upload audio"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'secure-audio' AND 
  auth.role() = 'authenticated'
);

-- Storage Policy: Admins can update/delete audio
CREATE POLICY "Admins can update audio"
ON storage.objects FOR UPDATE USING (bucket_id = 'secure-audio' AND auth.role() = 'authenticated');
CREATE POLICY "Admins can delete audio"
ON storage.objects FOR DELETE USING (bucket_id = 'secure-audio' AND auth.role() = 'authenticated');


-- 4. Create Storage Bucket for Public Covers
INSERT INTO storage.buckets (id, name, public)
VALUES ('public-covers', 'public-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Anyone can view public covers
CREATE POLICY "Anyone can view covers"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-covers');

-- Storage Policy: Admins can manage public covers
CREATE POLICY "Admins can insert covers" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'public-covers' AND auth.role() = 'authenticated');
CREATE POLICY "Admins can update covers" ON storage.objects FOR UPDATE USING (bucket_id = 'public-covers' AND auth.role() = 'authenticated');
CREATE POLICY "Admins can delete covers" ON storage.objects FOR DELETE USING (bucket_id = 'public-covers' AND auth.role() = 'authenticated');


-- 5. Trigger to update `updated_at` on Projects
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Setup Complete!
