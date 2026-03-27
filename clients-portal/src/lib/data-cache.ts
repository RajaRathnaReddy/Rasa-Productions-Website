import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

/**
 * Cached Supabase project fetcher — deduplicates identical requests
 * within a single React render tree (per request).
 */
export const getCachedProjects = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) console.error("[data-cache] getCachedProjects error:", error.message);
  return data ?? [];
});

export const getCachedProject = cache(async (id: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
});

export const getCachedEvents = cache(async (projectId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  return data ?? [];
});

export const getCachedRecentEvents = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("*, projects(project_title, client_name)")
    .order("created_at", { ascending: false })
    .limit(12);
  return data ?? [];
});
