import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { 
  FolderOpen, Users, Clock, CheckCircle2, MessageSquare, 
  PlusCircle, ExternalLink, Activity, TrendingUp, Zap
} from "lucide-react";

export const revalidate = 0;

const STATUS_COLORS: Record<string, string> = {
  "Draft": "text-zinc-400 bg-zinc-800/60 border-zinc-700/50",
  "In Review": "text-amber-300 bg-amber-950/60 border-amber-800/50",
  "Awaiting Client Feedback": "text-sky-300 bg-sky-950/60 border-sky-800/50",
  "Revision Requested": "text-orange-300 bg-orange-950/60 border-orange-800/50",
  "Approved": "text-emerald-300 bg-emerald-950/60 border-emerald-800/50",
  "Final Delivered": "text-violet-300 bg-violet-950/60 border-violet-800/50",
};

const EVENT_TYPE_ICONS: Record<string, string> = {
  "New Mix (V1.0)": "🎵",
  "Stem Request": "🎛️",
  "Feedback Needed": "💬",
  "Mastering Completed": "✅",
  "Update": "📌",
};

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ data: projects }, { data: events }] = await Promise.all([
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
    supabase.from("events").select("*, projects(project_title, client_name)").order("created_at", { ascending: false }).limit(8),
  ]);

  const totalProjects = projects?.length || 0;
  const inReview = projects?.filter((p: any) => p.status === "In Review").length || 0;
  const awaitingFeedback = projects?.filter((p: any) => p.status === "Awaiting Client Feedback").length || 0;
  const delivered = projects?.filter((p: any) => p.status === "Final Delivered").length || 0;
  const approved = projects?.filter((p: any) => p.status === "Approved").length || 0;
  const revisions = projects?.filter((p: any) => p.status === "Revision Requested").length || 0;

  // Unique clients
  const uniqueClients = new Set(projects?.map((p: any) => p.client_id) || []).size;

  const statCards = [
    { label: "Total Projects", value: totalProjects, icon: FolderOpen, color: "from-indigo-500/20 to-indigo-600/10", border: "border-indigo-500/30", iconColor: "text-indigo-400", href: "/admin/projects" },
    { label: "Active Clients", value: uniqueClients, icon: Users, color: "from-fuchsia-500/20 to-fuchsia-600/10", border: "border-fuchsia-500/30", iconColor: "text-fuchsia-400", href: "/admin/clients" },
    { label: "In Review", value: inReview, icon: Clock, color: "from-amber-500/20 to-amber-600/10", border: "border-amber-500/30", iconColor: "text-amber-400", href: "/admin/projects" },
    { label: "Awaiting Feedback", value: awaitingFeedback, icon: MessageSquare, color: "from-sky-500/20 to-sky-600/10", border: "border-sky-500/30", iconColor: "text-sky-400", href: "/admin/projects" },
    { label: "Approved", value: approved, icon: TrendingUp, color: "from-emerald-500/20 to-emerald-600/10", border: "border-emerald-500/30", iconColor: "text-emerald-400", href: "/admin/projects" },
    { label: "Final Delivered", value: delivered, icon: CheckCircle2, color: "from-violet-500/20 to-violet-600/10", border: "border-violet-500/30", iconColor: "text-violet-400", href: "/admin/projects" },
  ];

  const recentProjects = projects?.slice(0, 5) || [];

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Admin Overview</h1>
          </div>
          <p className="text-muted-foreground pl-[52px]">Your studio command centre — everything at a glance.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/projects/new">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white text-sm font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200">
              <PlusCircle className="w-4 h-4" />
              New Project
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group block">
            <div className={`relative overflow-hidden rounded-2xl border ${stat.border} bg-gradient-to-br ${stat.color} p-5 hover:scale-[1.02] transition-all duration-200 cursor-pointer`}>
              <div className="flex flex-col gap-3">
                <div className={`w-9 h-9 rounded-xl bg-black/20 flex items-center justify-center ${stat.iconColor}`}>
                  <stat.icon className="w-4.5 h-4.5" strokeWidth={1.8} />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white tabular-nums">{stat.value}</div>
                  <div className="text-xs font-medium text-white/50 mt-0.5 leading-tight">{stat.label}</div>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-white/3 translate-x-4 translate-y-4 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Recent Projects */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-indigo-400" />
              Recent Projects
            </h2>
            <Link href="/admin/projects" className="text-xs text-muted-foreground hover:text-white transition-colors">
              View all →
            </Link>
          </div>

          <div className="space-y-2">
            {recentProjects.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border/50 rounded-2xl text-muted-foreground">
                No projects yet. <Link href="/admin/projects/new" className="text-indigo-400 hover:underline">Create your first →</Link>
              </div>
            ) : (
              recentProjects.map((project: any) => (
                <Link key={project.id} href={`/admin/projects/${project.id}`} className="block group">
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-border/40 hover:border-indigo-500/30 hover:bg-white/[0.05] transition-all duration-200">
                    {/* Cover Image or Placeholder */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gradient-to-br from-indigo-900/60 to-fuchsia-900/40 border border-white/10 flex items-center justify-center">
                      {project.cover_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.cover_url} alt={project.project_title} className="w-full h-full object-cover" />
                      ) : (
                        <FolderOpen className="w-5 h-5 text-white/20" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-white text-sm truncate">{project.project_title}</div>
                      <div className="text-xs text-muted-foreground truncate">{project.song_title} · {project.client_name}</div>
                    </div>
                    <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border shrink-0 ${STATUS_COLORS[project.status] || "text-zinc-400 bg-zinc-800/60 border-zinc-700/50"}`}>
                      {project.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-fuchsia-400" />
              Recent Activity
            </h2>
          </div>

          <div className="space-y-2">
            {!events || events.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border/50 rounded-2xl text-muted-foreground text-sm">
                No activity yet.
              </div>
            ) : (
              events.map((ev: any) => (
                <div key={ev.id} className="flex gap-3 p-3 rounded-xl bg-white/[0.03] border border-border/30">
                  <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-sm shrink-0">
                    {EVENT_TYPE_ICONS[ev.type] || "📌"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{ev.title}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {(ev as any).projects?.project_title} · {(ev as any).projects?.client_name}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                      {new Date(ev.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Quick Links */}
          <div className="pt-2 border-t border-white/5 space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mb-3">Quick Actions</p>
            <a href="https://supabase.com/dashboard/project/_/auth/users" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all">
              <ExternalLink className="w-4 h-4 text-indigo-400" />
              Manage Auth in Supabase
            </a>
            <a href="https://supabase.com/dashboard/project/_/storage/buckets" target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white py-2 px-3 rounded-lg hover:bg-white/5 transition-all">
              <ExternalLink className="w-4 h-4 text-fuchsia-400" />
              Storage Buckets
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
