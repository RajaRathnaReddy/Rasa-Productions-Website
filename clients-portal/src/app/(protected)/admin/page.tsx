import { getCachedProjects, getCachedRecentEvents } from "@/lib/data-cache";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export const revalidate = 30;

export default async function AdminOverviewPage() {
  // Parallel fetch — much faster than sequential
  const [allProjects, events] = await Promise.all([
    getCachedProjects(),
    getCachedRecentEvents(),
  ]);

  const totalProjects    = allProjects.length;
  const inReview         = allProjects.filter((p) => p.status === "In Review").length;
  const awaitingFeedback = allProjects.filter((p) => p.status === "Awaiting Client Feedback").length;
  const delivered        = allProjects.filter((p) => p.status === "Final Delivered").length;
  const approved         = allProjects.filter((p) => p.status === "Approved").length;
  const uniqueClients    = new Set(allProjects.map((p) => p.client_id)).size;

  return (
    <AdminOverviewClient
      projects={allProjects}
      events={events}
      counts={{ totalProjects, uniqueClients, inReview, awaitingFeedback, approved, delivered }}
    />
  );
}
