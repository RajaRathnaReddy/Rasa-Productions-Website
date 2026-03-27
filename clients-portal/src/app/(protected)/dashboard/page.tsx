import { createClient } from "@/utils/supabase/server";
import { ClientDashboardView } from "@/components/dashboard/ClientDashboardView";
import { Project } from "@/lib/mock-data";

export const revalidate = 0;

export default async function ClientDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  // Fetch only projects belonging to this user
  const { data: projectsData } = await supabase
    .from("projects")
    .select("*")
    .eq("client_id", user.id)
    .order("created_at", { ascending: false });

  // Map snake_case from DB to camelCase expected by ClientDashboardView
  const projects: Project[] = (projectsData || []).map(p => ({
    id: p.id,
    clientId: p.client_id,
    clientName: p.client_name,
    projectTitle: p.project_title,
    songTitle: p.song_title,
    status: p.status,
    coverUrl: p.cover_url,
    updatedAt: p.updated_at,
  }));

  const stats = [
    { label: "Total Projects", value: projects.length },
    { label: "Awaiting Your Feedback", value: projects.filter(p => p.status === "Awaiting Client Feedback").length },
    { label: "In Review", value: projects.filter(p => p.status === "In Review").length },
    { label: "Approved / Delivered", value: projects.filter(p => p.status === "Approved" || p.status === "Final Delivered").length },
  ];

  return <ClientDashboardView projects={projects} stats={stats} />;
}

