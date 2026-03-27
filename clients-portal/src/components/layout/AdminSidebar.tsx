"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderOpen, Users, ChevronRight, ShieldCheck, Settings2 } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen, exact: false },
  { label: "Clients", href: "/admin/clients", icon: Users, exact: false },
  { label: "Settings", href: "/admin/settings", icon: Settings2, exact: false },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-60 shrink-0 border-r border-white/[0.07] bg-[#060610]/80 backdrop-blur-xl flex flex-col sticky top-16 h-[calc(100vh-4rem)]">
      {/* Admin Badge */}
      <div className="px-5 pt-6 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
            <ShieldCheck className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-widest uppercase">Admin Panel</div>
            <div className="text-[10px] text-muted-foreground">Rasa Productions</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 space-y-1">
        <p className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-widest px-3 mb-3">Navigation</p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${
                active
                  ? "bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/20 text-white border border-indigo-500/30 shadow-sm shadow-indigo-500/10"
                  : "text-white/50 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              <item.icon className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-indigo-400" : "text-white/30 group-hover:text-white/60"}`} strokeWidth={1.8} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-3.5 h-3.5 text-indigo-400/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 pb-6 pt-4 border-t border-white/[0.06]">
        <div className="text-[10px] text-muted-foreground/40 text-center">
          Rasa Productions Studio CMS
        </div>
      </div>
    </aside>
  );
}
