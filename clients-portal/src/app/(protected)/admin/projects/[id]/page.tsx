import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { AdminProjectManager } from "./AdminProjectManager";

export const revalidate = 0;

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch Project
  const { data: project, error: projError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projError || !project) {
    return notFound();
  }

  // Fetch Events for this project
  const { data: events, error: evError } = await supabase
    .from("events")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  return <AdminProjectManager project={project} initialEvents={events || []} />;
}
