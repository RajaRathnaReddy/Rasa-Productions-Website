"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Loader2, ArrowLeft, UploadCloud, FileAudio, Trash2, 
  Edit3, Save, X, ImagePlus, Music, Tag, FileText, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { analyzeAudio } from "@/utils/audio-analyzer";

const STATUS_CONFIG: Record<string, { color: string; dot: string }> = {
  "Draft":                     { color: "text-zinc-400",   dot: "bg-zinc-500" },
  "In Review":                 { color: "text-amber-300",  dot: "bg-amber-400" },
  "Awaiting Client Feedback":  { color: "text-sky-300",    dot: "bg-sky-400" },
  "Revision Requested":        { color: "text-orange-300", dot: "bg-orange-400" },
  "Approved":                  { color: "text-emerald-300",dot: "bg-emerald-400" },
  "Final Delivered":           { color: "text-violet-300", dot: "bg-violet-400" },
};

const STATUS_OPTIONS = ["Draft", "In Review", "Awaiting Client Feedback", "Revision Requested", "Approved", "Final Delivered"];

const EVENT_TYPE_ICONS: Record<string, string> = {
  "New Mix (V1.0)": "🎵",
  "Stem Request": "🎛️",
  "Feedback Needed": "💬",
  "Mastering Completed": "✅",
  "Update": "📌",
};

export function AdminProjectManager({ project, initialEvents }: { project: any; initialEvents: any[] }) {
  const router = useRouter();
  const supabase = createClient();
  const coverInputRef = useRef<HTMLInputElement>(null);

  // ── State ──
  const [events, setEvents] = useState(initialEvents);
  const [status, setStatus] = useState(project.status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

  // Cover image state
  const [coverUrl, setCoverUrl] = useState<string | null>(project.cover_url || null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  // Metadata edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    project_title: project.project_title,
    song_title: project.song_title,
    genre: project.genre || "",
    bpm: project.bpm || "",
    key: project.key || "",
    notes: project.notes || "",
  });
  const [isSavingMeta, setIsSavingMeta] = useState(false);

  /* ── UPDATE STATUS ── */
  const handleUpdateStatus = async (newStatus: string) => {
    setIsUpdatingStatus(true);
    const { error } = await supabase.from("projects").update({ status: newStatus }).eq("id", project.id);
    if (!error) { setStatus(newStatus); router.refresh(); }
    setIsUpdatingStatus(false);
  };

  /* ── SAVE METADATA ── */
  const handleSaveMeta = async () => {
    setIsSavingMeta(true);
    const { error } = await supabase.from("projects").update(editData).eq("id", project.id);
    if (!error) { setIsEditing(false); router.refresh(); }
    setIsSavingMeta(false);
  };

  /* ── COVER IMAGE UPLOAD ── */
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));
    setIsUploadingCover(true);

    const ext = file.name.split(".").pop();
    const path = `${project.client_id}/${project.id}-cover.${ext}`;
    const { data: upData, error: upErr } = await supabase.storage
      .from("public-covers")
      .upload(path, file, { upsert: true });

    if (upErr) {
      alert("Cover upload failed: " + upErr.message);
      setIsUploadingCover(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("public-covers").getPublicUrl(upData.path);
    const publicUrl = urlData.publicUrl;

    await supabase.from("projects").update({ cover_url: publicUrl }).eq("id", project.id);
    setCoverUrl(publicUrl);
    setCoverPreview(null);
    setIsUploadingCover(false);
    router.refresh();
  };

  /* ── ADD EVENT ── */
  const handleAddEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAddingEvent(true);
    setUploadProgress("Starting...");

    const fd = new FormData(e.currentTarget);
    const title = fd.get("title") as string;
    const type = fd.get("type") as string;
    const desc = fd.get("description") as string;
    const file = fd.get("audio_file") as File;

    let audioUrl = null;

    if (file && file.size > 0) {
      setUploadProgress("Analyzing BPM & Key…");
      try {
        const { bpm, key } = await analyzeAudio(file);
        
        // Save the analyzed metadata back to the project automatically
        setEditData(d => ({ ...d, bpm, key }));
        await supabase.from("projects").update({ bpm, key }).eq("id", project.id);
      } catch (err) {
        console.error("Audio analysis failed:", err);
      }

      setUploadProgress("Uploading audio…");
      const fileExt = file.name.split(".").pop();
      const fileName = `${project.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("secure-audio")
        .upload(fileName, file);

      if (uploadError) {
        alert("Audio upload failed: " + uploadError.message);
        setIsAddingEvent(false);
        setUploadProgress("");
        return;
      }
      audioUrl = uploadData.path;
    }

    setUploadProgress("Saving…");
    const { data: newEvent, error: insertError } = await supabase
      .from("events")
      .insert({ project_id: project.id, type, title, description: desc, audio_url: audioUrl })
      .select()
      .single();

    if (insertError) {
      alert("Failed to create event: " + insertError.message);
    } else if (newEvent) {
      setEvents([newEvent, ...events]);
      (e.target as HTMLFormElement).reset();
    }

    setUploadProgress("");
    setIsAddingEvent(false);
    router.refresh();
  };

  /* ── DELETE EVENT ── */
  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("Delete this timeline event? This cannot be undone.")) return;
    setDeletingEventId(eventId);
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (!error) {
      setEvents(events.filter(ev => ev.id !== eventId));
    } else {
      alert("Failed to delete event: " + error.message);
    }
    setDeletingEventId(null);
  };

  const sc = STATUS_CONFIG[status] || STATUS_CONFIG["Draft"];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
      </Link>

      {/* ── PROJECT HEADER ── */}
      <div className="rounded-2xl border border-border/40 bg-white/[0.02] overflow-hidden">
        <div className="flex flex-col md:flex-row gap-0">
          {/* Cover Image Panel */}
          <div className="md:w-52 relative shrink-0 bg-gradient-to-br from-indigo-900/40 to-fuchsia-900/30 flex items-center justify-center min-h-[200px]">
            {(coverPreview || coverUrl) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverPreview || coverUrl || ""}
                alt="Cover"
                className="w-full h-full object-cover absolute inset-0"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-white/20 p-8">
                <ImagePlus className="w-10 h-10" />
                <span className="text-xs">No cover</span>
              </div>
            )}
            {/* Upload button overlay */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/40 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
              <label
                htmlFor="cover-change"
                className="cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg bg-white/20 backdrop-blur text-white text-xs font-semibold hover:bg-white/30 transition-all"
              >
                {isUploadingCover ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImagePlus className="w-3.5 h-3.5" />}
                {coverUrl ? "Change" : "Upload Cover"}
              </label>
            </div>
            <input
              id="cover-change"
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCoverChange}
            />
            {isUploadingCover && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </div>
            )}
          </div>

          {/* Meta Panel */}
          <div className="flex-1 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      value={editData.project_title}
                      onChange={e => setEditData(d => ({ ...d, project_title: e.target.value }))}
                      className="w-full text-2xl font-bold bg-transparent border-b border-indigo-500/50 text-white focus:outline-none pb-1"
                      placeholder="Project Title"
                    />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        value={editData.song_title}
                        onChange={e => setEditData(d => ({ ...d, song_title: e.target.value }))}
                        className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/40"
                        placeholder="Song title"
                      />
                      <input
                        value={editData.genre}
                        onChange={e => setEditData(d => ({ ...d, genre: e.target.value }))}
                        className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/40"
                        placeholder="Genre / style"
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <input
                        value={editData.bpm}
                        onChange={e => setEditData(d => ({ ...d, bpm: e.target.value }))}
                        className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/40"
                        placeholder="BPM (e.g. 120)"
                      />
                      <input
                        value={editData.key}
                        onChange={e => setEditData(d => ({ ...d, key: e.target.value }))}
                        className="px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/40"
                        placeholder="Key (e.g. C Min)"
                      />
                    </div>
                    <textarea
                      value={editData.notes}
                      onChange={e => setEditData(d => ({ ...d, notes: e.target.value }))}
                      rows={2}
                      className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500/40 resize-none"
                      placeholder="Internal notes…"
                    />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-white truncate">{editData.project_title}</h1>
                    <p className="text-white/60 text-sm mt-1 flex items-center gap-2">
                      <Music className="w-3.5 h-3.5 text-fuchsia-400" />
                      {editData.song_title}
                      {editData.genre && (
                        <span className="flex items-center gap-1 text-xs">
                          <Tag className="w-3 h-3 text-indigo-400" />
                          {editData.genre}
                        </span>
                      )}
                      {(editData.bpm || editData.key) && (
                        <span className="flex items-center gap-2 text-xs opacity-70 border-l border-white/10 pl-2 ml-1">
                          {editData.bpm && <span>{editData.bpm}</span>}
                          {editData.key && <span>• {editData.key}</span>}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Client: {project.client_name}</p>
                    {editData.notes && (
                      <p className="text-xs text-muted-foreground/70 mt-2 flex items-start gap-1.5">
                        <FileText className="w-3 h-3 mt-0.5 shrink-0" />
                        {editData.notes}
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="flex gap-2 shrink-0">
                {isEditing ? (
                  <>
                    <Button
                      size="sm"
                      onClick={handleSaveMeta}
                      disabled={isSavingMeta}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white h-8 px-3 text-xs"
                    >
                      {isSavingMeta ? <Loader2 className="w-3 h-3 animate-spin" /> : <><Save className="w-3 h-3 mr-1" />Save</>}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditing(false)}
                      className="text-muted-foreground h-8 px-3 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-white/10 bg-white/5 hover:bg-white/10 text-white h-8 px-3 text-xs gap-1.5"
                  >
                    <Edit3 className="w-3 h-3" /> Edit
                  </Button>
                )}
              </div>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-3 pt-2 border-t border-white/5">
              <span className={`flex items-center gap-1.5 text-xs font-bold ${sc.color}`}>
                <span className={`w-2 h-2 rounded-full ${sc.dot} animate-pulse`} />
                {status}
              </span>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Update status:</span>
                <Select value={status} onValueChange={handleUpdateStatus} disabled={isUpdatingStatus}>
                  <SelectTrigger className="w-[200px] h-8 border-border/50 bg-black/40 text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isUpdatingStatus && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── TIMELINE + FORM ── */}
      <div className="grid lg:grid-cols-[1fr_380px] gap-8">

        {/* Timeline Feed */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Timeline Feed
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/60">
              {events.length} event{events.length !== 1 ? "s" : ""}
            </span>
          </h3>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 border border-dashed border-border/50 rounded-2xl text-muted-foreground">
              <Music className="w-10 h-10 opacity-20" />
              <div className="text-center">
                <p className="font-medium text-white/30">No events yet</p>
                <p className="text-sm mt-1">Use the form to post the first update.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((ev: any) => (
                <div key={ev.id} className="group flex gap-4 p-4 rounded-2xl bg-white/[0.03] border border-border/30 hover:border-indigo-500/20 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-lg shrink-0">
                    {EVENT_TYPE_ICONS[ev.type] || "📌"}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="font-semibold text-white text-sm">{ev.title}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                      <span>{ev.type}</span>
                      <span>·</span>
                      <span>{new Date(ev.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    {ev.description && (
                      <p className="text-sm text-white/60 mt-2">{ev.description}</p>
                    )}
                    {ev.audio_url && (
                      <div className="mt-2 flex items-center gap-2 bg-fuchsia-500/10 border border-fuchsia-500/20 px-3 py-1.5 rounded-lg w-fit">
                        <FileAudio className="w-3.5 h-3.5 text-fuchsia-400" />
                        <span className="text-fuchsia-300 text-xs font-mono">{ev.audio_url.split("/").pop()}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(ev.id)}
                    disabled={deletingEventId === ev.id}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground/30 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 shrink-0 self-start mt-0.5 border border-transparent hover:border-red-500/20"
                    title="Delete event"
                  >
                    {deletingEventId === ev.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Event Form */}
        <div>
          <div className="rounded-2xl border border-border/40 bg-gradient-to-br from-indigo-950/40 to-fuchsia-950/20 sticky top-24 overflow-hidden">
            <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
              <h3 className="font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-indigo-400" />
                Push New Update
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Add a milestone or upload a new mix. Visible on client timeline immediately.
              </p>
            </div>
            <div className="p-5">
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Event Type</label>
                  <Select name="type" required defaultValue="New Mix (V1.0)">
                    <SelectTrigger className="bg-black/30 border-white/10 h-9">
                      <SelectValue placeholder="Event Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New Mix (V1.0)">🎵 New Mix Upload</SelectItem>
                      <SelectItem value="Stem Request">🎛️ Stem Request</SelectItem>
                      <SelectItem value="Feedback Needed">💬 Feedback Needed</SelectItem>
                      <SelectItem value="Mastering Completed">✅ Mastering Completed</SelectItem>
                      <SelectItem value="Update">📌 General Update</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Event Title</label>
                  <input
                    name="title"
                    required
                    placeholder="e.g. Mastered Output V1.2"
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-indigo-500/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Description</label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="e.g. Boosted vocal frequencies by 2dB, adjusted low-end..."
                    className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-white text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-indigo-500/40 resize-none"
                  />
                </div>

                <div className="space-y-1.5 pt-2 border-t border-white/5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                    <FileAudio className="w-3.5 h-3.5 text-fuchsia-400" />
                    Secure Audio File
                  </label>
                  <input
                    type="file"
                    name="audio_file"
                    accept=".wav,.mp3,audio/*"
                    className="w-full text-sm text-muted-foreground file:mr-3 file:px-3 file:py-1.5 file:rounded-lg file:border-0 file:bg-indigo-600/50 file:text-white file:text-xs file:font-semibold file:cursor-pointer cursor-pointer bg-black/20 border border-white/10 rounded-lg px-3 py-2"
                  />
                  <p className="text-[10px] text-muted-foreground/60">Stored in private Supabase bucket, protected by RLS + signed URLs.</p>
                </div>

                <button
                  type="submit"
                  disabled={isAddingEvent}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 disabled:opacity-50 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/10"
                >
                  {isAddingEvent ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />{uploadProgress || "Publishing…"}</>
                  ) : (
                    <><CheckCircle2 className="w-4 h-4" />Publish to Timeline</>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
