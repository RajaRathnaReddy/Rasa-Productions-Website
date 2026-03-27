-- Rasa Productions Client Portal - Supabase Schema Definition

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: users (extends Supabase auth.users)
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('super_admin', 'client')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: projects
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.users(id) on delete cascade not null,
  project_title text not null,
  song_title text not null,
  cover_url text,
  drive_audio_id text,
  lyrics text,
  status text not null default 'Draft' check (status in ('Draft', 'In Review', 'Awaiting Client Feedback', 'Revision Requested', 'Approved', 'Final Delivered')),
  revision_count integer default 0,
  delivery_status text,
  internal_notes text,
  client_visible_notes text,
  final_approved boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: feedback (comments and corrections)
create table public.feedback (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  content text not null,
  type text not null default 'comment' check (type in ('comment', 'correction', 'system')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) setup

-- users: admins can read/write all, clients can read their own
alter table public.users enable row level security;
create policy "Admins can do everything on users" on public.users for all using (
  auth.uid() in (select id from public.users where role = 'super_admin')
);
create policy "Users can view their own record" on public.users for select using (
  auth.uid() = id
);

-- projects: admins can read/write all, clients can read their own
alter table public.projects enable row level security;
create policy "Admins can do everything on projects" on public.projects for all using (
  auth.uid() in (select id from public.users where role = 'super_admin')
);
create policy "Clients can view their own projects" on public.projects for select using (
  auth.uid() = client_id
);

-- feedback: admins can read/write all, clients can read/write their own
alter table public.feedback enable row level security;
create policy "Admins can do everything on feedback" on public.feedback for all using (
  auth.uid() in (select id from public.users where role = 'super_admin')
);
create policy "Clients can view their own project feedback" on public.feedback for select using (
  auth.uid() = user_id or project_id in (select id from public.projects where client_id = auth.uid())
);
create policy "Clients can insert feedback on their own projects" on public.feedback for insert with check (
  project_id in (select id from public.projects where client_id = auth.uid()) and auth.uid() = user_id
);
