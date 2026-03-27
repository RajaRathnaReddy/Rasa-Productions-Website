import { getCachedProject, getCachedEvents } from "@/lib/data-cache";
import { notFound } from "next/navigation";
import { AdminProjectManager } from "./AdminProjectManager";

// Cache for 20 seconds — fast enough for live updates, no full refetch every click
export const revalidate = 20;

export default async function AdminProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Parallel fetch using cached helpers — deduplication guaranteed by React cache()
  const [project, events] = await Promise.all([
    getCachedProject(id),
    getCachedEvents(id),
  ]);

  if (!project) return notFound();

  return <AdminProjectManager project={project} initialEvents={events} />;
}
