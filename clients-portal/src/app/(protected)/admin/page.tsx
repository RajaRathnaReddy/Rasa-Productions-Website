import { createClient } from "@/utils/supabase/server";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ data: projects }, { data: events }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("*, projects(project_title, client_name)").order("created_at", { ascending: false }).limit(12),
  ]);

  const allProjects = projects || [];
  const totalProjects = allProjects.length;
  const inReview      = allProjects.filter((p: any) => p.status === "In Review").length;
  const awaitingFeedback = allProjects.filter((p: any) => p.status === "Awaiting Client Feedback").length;
  const delivered     = allProjects.filter((p: any) => p.status === "Final Delivered").length;
  const approved      = allProjects.filter((p: any) => p.status === "Approved").length;
  const uniqueClients = new Set(allProjects.map((p: any) => p.client_id)).size;

  return (
    <AdminOverviewClient
      projects={allProjects}
      events={events || []}
      counts={{ totalProjects, uniqueClients, inReview, awaitingFeedback, approved, delivered }}
    />
  );
}
