import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Users, ExternalLink, ShieldCheck, FolderOpen, Activity } from "lucide-react";

export const revalidate = 0;

export default async function AdminClientsPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("client_id, client_name, id, status, cover_url, song_title, project_title, created_at");

  // Group projects by client
  const clientsMap = new Map<string, any>();

  if (projects) {
    projects.forEach((p: any) => {
      if (!clientsMap.has(p.client_id)) {
        clientsMap.set(p.client_id, {
          id: p.client_id,
          name: p.client_name,
          projectsCount: 0,
          activeProjects: 0,
          recentProjects: [],
        });
      }
      const client = clientsMap.get(p.client_id);
      client.projectsCount += 1;
      if (p.status !== "Final Delivered") {
        client.activeProjects += 1;
      }
      if (client.recentProjects.length < 3) {
        client.recentProjects.push(p);
      }
    });
  }

  const activeClients = Array.from(clientsMap.values());

  const totalActive = activeClients.filter(c => c.activeProjects > 0).length;

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
            <Users className="w-7 h-7 text-fuchsia-400" />
            Client Directory
          </h1>
          <p className="text-muted-foreground text-sm">Manage your studio clients and their associated projects.</p>
        </div>
        <a href="https://supabase.com/dashboard/project/_/auth/users" target="_blank" rel="noreferrer">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 text-white text-sm font-semibold transition-all">
            <ExternalLink className="w-4 h-4 text-indigo-400" />
            Manage Auth in Supabase
          </button>
        </a>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/10 to-fuchsia-600/5">
          <div className="text-3xl font-bold text-white tabular-nums">{activeClients.length}</div>
          <div className="text-xs text-white/50 mt-1">Total Clients</div>
        </div>
        <div className="p-5 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5">
          <div className="text-3xl font-bold text-white tabular-nums">{totalActive}</div>
          <div className="text-xs text-white/50 mt-1">With Active Projects</div>
        </div>
        <div className="col-span-2 md:col-span-1 flex items-start gap-3 p-4 rounded-2xl border border-indigo-500/30 bg-indigo-950/30">
          <ShieldCheck className="w-7 h-7 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-200/60">
            Full user management (passwords, emails, invite) is handled in your <strong className="text-indigo-300">Supabase Authentication Dashboard</strong> for security.
          </div>
        </div>
      </div>

      {/* Clients Grid */}
      {error ? (
        <div className="text-red-400 p-4 border border-red-900/50 rounded-xl bg-red-950/20 text-sm">
          Failed to load clients: {error.message}
        </div>
      ) : activeClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 border border-dashed border-border/50 rounded-2xl text-muted-foreground gap-3">
          <Users className="w-12 h-12 opacity-20" />
          <div className="text-center">
            <p className="font-medium text-white/30">No clients yet</p>
            <p className="text-sm mt-1">Create your first project to see the client listed here.</p>
          </div>
          <Link href="/admin/projects/new">
            <button className="mt-2 px-4 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-sm font-semibold transition-all">
              Create First Project →
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {activeClients.map((client) => (
            <div key={client.id} className="group rounded-2xl border border-border/40 bg-white/[0.02] hover:border-fuchsia-500/20 hover:bg-white/[0.04] transition-all duration-200 overflow-hidden flex flex-col">
              {/* Client Header */}
              <div className="p-5 border-b border-white/[0.05]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
                      <span className="text-lg font-bold text-white">{client.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-white truncate">{client.name}</div>
                      <code className="text-[9px] text-muted-foreground/50 font-mono truncate block">{client.id}</code>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-4 mt-4">
                  <div className="flex items-center gap-1.5 text-sm">
                    <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-bold text-white">{client.projectsCount}</span>
                    <span className="text-muted-foreground text-xs">projects</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Activity className="w-3.5 h-3.5 text-emerald-400" />
                    {client.activeProjects > 0 ? (
                      <>
                        <span className="font-bold text-emerald-400">{client.activeProjects}</span>
                        <span className="text-muted-foreground text-xs">active</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground text-xs">All delivered</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Projects */}
              {client.recentProjects.length > 0 && (
                <div className="p-4 flex-1 space-y-2">
                  <p className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-semibold">Recent Projects</p>
                  {client.recentProjects.map((proj: any) => (
                    <Link key={proj.id} href={`/admin/projects/${proj.id}`} className="flex items-center gap-2.5 group/proj">
                      <div className="w-8 h-8 rounded-lg overflow-hidden bg-gradient-to-br from-indigo-900/50 to-fuchsia-900/30 border border-white/8 flex items-center justify-center shrink-0">
                        {proj.cover_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={proj.cover_url} alt={proj.project_title} className="w-full h-full object-cover" />
                        ) : (
                          <FolderOpen className="w-3.5 h-3.5 text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white/80 group-hover/proj:text-white truncate transition-colors">{proj.project_title}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{proj.song_title}</div>
                      </div>
                      <span className="text-indigo-400 text-xs opacity-0 group-hover/proj:opacity-100 transition-opacity shrink-0">→</span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Footer Action */}
              <div className="px-4 py-3 border-t border-white/[0.05]">
                <Link href={`/admin/projects`} className="block">
                  <button className="w-full text-xs font-semibold text-muted-foreground hover:text-white py-1.5 rounded-lg hover:bg-white/5 transition-all">
                    View All Projects →
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
