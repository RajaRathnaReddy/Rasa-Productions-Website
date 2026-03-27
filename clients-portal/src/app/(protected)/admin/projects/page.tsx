import { getCachedProjects } from "@/lib/data-cache";
import ProjectsListClient from "./ProjectsListClient";

// Revalidate every 30s — avoids full server fetch on every click
export const revalidate = 30;

export default async function AdminProjectsPage() {
  const projects = await getCachedProjects();
  return <ProjectsListClient projects={projects} />;
}
