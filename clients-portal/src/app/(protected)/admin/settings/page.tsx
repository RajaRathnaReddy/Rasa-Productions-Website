"use client";

import { useState, useEffect, useTransition } from "react";
import { createClient } from "@/utils/supabase/client";
import { Settings2, Bell, LayoutDashboard, Mic2, MessageSquare, History, Save, Loader2, CheckCircle2, Phone, Mail, ToggleLeft, ToggleRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Default settings shape
const DEFAULT_SETTINGS = {
  contact_banner_enabled: false,
  contact_email_primary: "Hello@rasaproductions.in",
  contact_email_secondary: "a.rajarathnareddychennai@gmail.com",
  contact_phone: "9133777017",
  // Client dashboard feature toggles
  feature_audio_versions: true,
  feature_feedback_panel: true,
  feature_lyrics_submit: true,
  feature_project_team: true,
  feature_timeline: true,
};

type Settings = typeof DEFAULT_SETTINGS;

function Toggle({ enabled, onToggle, label, description, icon: Icon, color = "indigo" }: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description: string;
  icon: any;
  color?: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: "from-indigo-500/20 to-indigo-600/10 border-indigo-500/30",
    emerald: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30",
    rose: "from-rose-500/20 to-rose-600/10 border-rose-500/30",
    amber: "from-amber-500/20 to-amber-600/10 border-amber-500/30",
    fuchsia: "from-fuchsia-500/20 to-fuchsia-600/10 border-fuchsia-500/30",
    cyan: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/30",
  };
  return (
    <div className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br border transition-all ${enabled ? colorMap[color] : "from-white/[0.02] to-white/[0.01] border-white/8"}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 shrink-0 ${enabled ? `text-${color}-400` : "text-white/20"}`} />
        <div>
          <p className="text-sm font-bold text-white">{label}</p>
          <p className="text-xs text-white/35">{description}</p>
        </div>
      </div>
      <button onClick={onToggle} className="shrink-0 transition-all">
        {enabled
          ? <ToggleRight className={`w-8 h-8 text-${color}-400`} />
          : <ToggleLeft className="w-8 h-8 text-white/20" />}
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const supabase = createClient();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, startSave] = useTransition();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("site_settings").select("*").eq("id", 1).single();
      if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
      setLoading(false);
    }
    load();
  }, []);

  const set = (key: keyof Settings, value: any) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const toggle = (key: keyof Settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    startSave(async () => {
      await supabase.from("site_settings").upsert({ id: 1, ...settings });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings2 className="w-7 h-7 text-indigo-400" /> Site Settings
          </h1>
          <p className="text-sm text-white/35 mt-1">Control what clients see and how the site behaves.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* ── SECTION 1: Contact Banner ── */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center gap-3">
          <Bell className="w-4 h-4 text-amber-400" />
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Contact Banner</h2>
            <p className="text-xs text-white/35">Show a sticky banner on the homepage with contact info</p>
          </div>
          <div className="ml-auto">
            <button onClick={() => toggle("contact_banner_enabled")}>
              {settings.contact_banner_enabled
                ? <ToggleRight className="w-8 h-8 text-amber-400" />
                : <ToggleLeft className="w-8 h-8 text-white/20" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {settings.contact_banner_enabled && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs text-white/40 font-bold uppercase tracking-widest flex items-center gap-1.5"><Mail className="w-3 h-3" /> Primary Email</label>
                  <input
                    value={settings.contact_email_primary}
                    onChange={e => set("contact_email_primary", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40 font-bold uppercase tracking-widest flex items-center gap-1.5"><Mail className="w-3 h-3" /> Secondary Email</label>
                  <input
                    value={settings.contact_email_secondary}
                    onChange={e => set("contact_email_secondary", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-white/40 font-bold uppercase tracking-widest flex items-center gap-1.5"><Phone className="w-3 h-3" /> Phone</label>
                  <input
                    value={settings.contact_phone}
                    onChange={e => set("contact_phone", e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                {/* Preview */}
                <div className="mt-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/80 flex flex-wrap items-center gap-3">
                  <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>⚠️ For any issues, contact us:</span>
                  <span className="font-mono">{settings.contact_email_primary}</span>
                  <span className="font-mono">{settings.contact_email_secondary}</span>
                  <span className="font-mono">📞 {settings.contact_phone}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── SECTION 2: Client Dashboard Feature Toggles ── */}
      <div className="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8 flex items-center gap-3">
          <LayoutDashboard className="w-4 h-4 text-indigo-400" />
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Client Dashboard Features</h2>
            <p className="text-xs text-white/35">Control which sections are visible to clients on their project page</p>
          </div>
        </div>
        <div className="p-6 space-y-3">
          <Toggle
            enabled={settings.feature_timeline}
            onToggle={() => toggle("feature_timeline")}
            label="Project Timeline"
            description="Show the full event timeline to clients"
            icon={History}
            color="indigo"
          />
          <Toggle
            enabled={settings.feature_audio_versions}
            onToggle={() => toggle("feature_audio_versions")}
            label="Audio Versions Panel"
            description="Allow clients to switch between uploaded mix versions"
            icon={Mic2}
            color="cyan"
          />
          <Toggle
            enabled={settings.feature_feedback_panel}
            onToggle={() => toggle("feature_feedback_panel")}
            label="Feedback Panel"
            description="Show the 'Quick Note to Studio' feedback textarea"
            icon={MessageSquare}
            color="rose"
          />
          <Toggle
            enabled={settings.feature_lyrics_submit}
            onToggle={() => toggle("feature_lyrics_submit")}
            label="Submit Lyrics Button"
            description="Show the 'Submit Lyrics' button in the top navigation"
            icon={Mic2}
            color="fuchsia"
          />
          <Toggle
            enabled={settings.feature_project_team}
            onToggle={() => toggle("feature_project_team")}
            label="Project Team Panel"
            description="Show the 'Project Team' card on the right sidebar"
            icon={Settings2}
            color="emerald"
          />
        </div>
      </div>

      {/* Save reminder */}
      <p className="text-xs text-white/20 text-center">Changes are applied immediately after saving. The homepage banner updates within 30 seconds.</p>
    </div>
  );
}
