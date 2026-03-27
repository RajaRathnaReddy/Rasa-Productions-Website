import { createClient } from "@/utils/supabase/server";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";
import { 
  FolderOpen, Users, Clock, CheckCircle2, MessageSquare, TrendingUp
} from "lucide-react";

export const revalidate = 0;

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ data: projects }, { data: events }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("*, projects(project_title, client_name)").order("created_at", { ascending: false }).limit(12),
  ]);

  const totalProjects = projects?.length || 0;
  const inReview      = projects?.filter((p: any) => p.status === "In Review").length || 0;
  const awaitingFeedback = projects?.filter((p: any) => p.status === "Awaiting Client Feedback").length || 0;
  const delivered     = projects?.filter((p: any) => p.status === "Final Delivered").length || 0;
  const approved      = projects?.filter((p: any) => p.status === "Approved").length || 0;
  const uniqueClients = new Set(projects?.map((p: any) => p.client_id) || []).size;

  const statCards = [
    { label: "Total Projects", value: totalProjects, icon: FolderOpen, color: "from-indigo-500/20 to-indigo-600/10", border: "border-indigo-500/30", iconColor: "text-indigo-400", href: "/admin/projects" },
    { label: "Active Clients",  value: uniqueClients, icon: Users,      color: "from-fuchsia-500/20 to-fuchsia-600/10", border: "border-fuchsia-500/30", iconColor: "text-fuchsia-400", href: "/admin/clients" },
    { label: "In Review",       value: inReview,      icon: Clock,      color: "from-amber-500/20 to-amber-600/10",   border: "border-amber-500/30",   iconColor: "text-amber-400",   href: "/admin/projects" },
    { label: "Awaiting Feedback",value: awaitingFeedback, icon: MessageSquare, color: "from-sky-500/20 to-sky-600/10", border: "border-sky-500/30", iconColor: "text-sky-400", href: "/admin/projects" },
    { label: "Approved",        value: approved,      icon: TrendingUp, color: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-500/30", iconColor: "text-emerald-400", href: "/admin/projects" },
    { label: "Final Delivered", value: delivered,     icon: CheckCircle2, color: "from-violet-500/20 to-violet-600/10", border: "border-violet-500/30", iconColor: "text-violet-400", href: "/admin/projects" },
  ];

  return (
    <AdminOverviewClient
      projects={projects || []}
      events={events || []}
      statCards={statCards}
      totalProjects={totalProjects}
      delivered={delivered}
    />
  );
}
