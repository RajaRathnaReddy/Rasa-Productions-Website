import { createClient } from "@/utils/supabase/server";
import ProjectsListClient from "./ProjectsListClient";

export const revalidate = 0;

export default async function AdminProjectsPage() {
  const supabase = await createClient();
  
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return <ProjectsListClient projects={projects || []} />;
}
