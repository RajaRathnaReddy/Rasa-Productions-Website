-- ==============================================================================
-- MIGRATION: Add BPM and Key to Projects
-- Run this in the Supabase SQL Editor
-- ==============================================================================

-- Add 'bpm' column (text, optional)
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS bpm TEXT;

-- Add 'key' column (text, optional)
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS key TEXT;

-- Done! Existing rows will simply have NULL.
