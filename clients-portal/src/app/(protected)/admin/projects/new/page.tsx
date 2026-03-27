"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, Loader2, ImagePlus, X, Music, User, Tag, FileText, Sparkles } from "lucide-react";
import Link from "next/link";

export default function CreateProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const removeCover = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const client_id = fd.get("client_id") as string;
    const client_name = fd.get("client_name") as string;
    const project_title = fd.get("project_title") as string;
    const song_title = fd.get("song_title") as string;
    const genre = fd.get("genre") as string;
    const bpm = fd.get("bpm") as string;
    const key = fd.get("key") as string;
    const notes = fd.get("notes") as string;

    let cover_url: string | null = null;

    // Upload cover image if provided
    if (coverFile) {
      const ext = coverFile.name.split(".").pop();
      const path = `${client_id || "unknown"}/${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("public-covers")
        .upload(path, coverFile, { upsert: true });

      if (uploadErr) {
        setError("Cover image upload failed: " + uploadErr.message);
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("public-covers")
        .getPublicUrl(uploadData.path);
      cover_url = urlData.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from("projects")
      .insert([{ client_id, client_name, project_title, song_title, genre, bpm, key, notes, status: "Draft", cover_url }])
      .select()
      .single();

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      router.push(`/admin/projects/${data.id}`);
      router.refresh();
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <Link href="/admin/projects" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Projects
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Create New Project</h1>
          <p className="text-sm text-muted-foreground">Set up a workspace for a client track.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 text-sm text-red-300 bg-red-950/40 border border-red-800/50 rounded-xl">
            {error}
          </div>
        )}

        {/* Cover Image Upload */}
        <div className="rounded-2xl border border-border/40 bg-white/[0.02] p-6">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest mb-4 flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-fuchsia-400" /> Cover Image
          </h2>
          <div className="flex items-start gap-5">
            {/* Preview */}
            <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-900/60 to-fuchsia-900/40 border border-white/10 flex items-center justify-center shrink-0">
              {coverPreview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={removeCover}
                    className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </>
              ) : (
                <ImagePlus className="w-8 h-8 text-white/15" />
              )}
            </div>
            <div className="flex-1 space-y-2">
              <p className="text-sm text-muted-foreground">Upload a cover art for this project. Recommended: square image, min 400×400px.</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
                id="cover-upload"
              />
              <label
                htmlFor="cover-upload"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 text-sm text-white cursor-pointer transition-all"
              >
                <ImagePlus className="w-4 h-4 text-fuchsia-400" />
                {coverPreview ? "Change Image" : "Choose Image"}
              </label>
              {coverFile && (
                <p className="text-xs text-muted-foreground/70">{coverFile.name} ({(coverFile.size / 1024).toFixed(0)} KB)</p>
              )}
            </div>
          </div>
        </div>

        {/* Client Info */}
        <div className="rounded-2xl border border-border/40 bg-white/[0.02] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4 text-sky-400" /> Client Info
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Client Auth UUID <span className="text-red-400">*</span></label>
              <input
                name="client_id"
                required
                placeholder="550e8400-e29b-41d4-a716-446655440000"
                className="w-full px-3 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-sm font-mono placeholder:text-muted-foreground/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              />
              <p className="text-[11px] text-muted-foreground">Find in Supabase → Auth → Users.</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Client Display Name <span className="text-red-400">*</span></label>
              <input
                name="client_name"
                required
                placeholder="e.g. John Doe"
                className="w-full px-3 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Project Info */}
        <div className="rounded-2xl border border-border/40 bg-white/[0.02] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest flex items-center gap-2">
            <Music className="w-4 h-4 text-indigo-400" /> Project Info
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Project / EP Title <span className="text-red-400">*</span></label>
              <input
                name="project_title"
                required
                placeholder="e.g. Gospel Devotionals EP"
                className="w-full px-3 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Song Title <span className="text-red-400">*</span></label>
              <input
                name="song_title"
                required
                placeholder="e.g. Praise the Lord"
                className="w-full px-3 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-fuchsia-400" /> Genre / Style
              </label>
              <input
                name="genre"
                placeholder="e.g. Gospel, Hip-Hop, R&B…"
                className="w-full px-3 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                BPM
              </label>
              <input
                name="bpm"
                placeholder="e.g. 120"
                className="w-full px-3 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80 flex items-center gap-2">
                Key
              </label>
              <input
                name="key"
                placeholder="e.g. C Min"
                className="w-full px-3 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
              />
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-2xl border border-border/40 bg-white/[0.02] p-6 space-y-3">
          <h2 className="text-sm font-semibold text-white/70 uppercase tracking-widest flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" /> Internal Notes
          </h2>
          <textarea
            name="notes"
            rows={4}
            placeholder="e.g. Client wants a gospel feel, reference track is linked below. Target BPM 90–100…"
            className="w-full px-3 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 resize-none"
          />
          <p className="text-[11px] text-muted-foreground">These notes are only visible to admin, not the client.</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all duration-200 text-sm"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Creating Project…</>
          ) : (
            <><Sparkles className="w-4 h-4" /> Create Project</>
          )}
        </button>
      </form>
    </div>
  );
}
