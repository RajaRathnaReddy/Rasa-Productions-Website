-- ==============================================================================
-- MIGRATION: Add missing columns to projects table
-- Run this in the Supabase SQL Editor if your projects table is already created.
-- ==============================================================================

-- Add 'genre' column (text, optional)
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS genre TEXT;

-- Add 'notes' column (text, optional — admin-only internal notes)
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS notes TEXT;

-- The 'cover_url' column already exists in the original schema.
-- If for any reason it doesn't, run:
-- ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Done! No data is lost. Existing rows will simply have NULL for these new columns.
