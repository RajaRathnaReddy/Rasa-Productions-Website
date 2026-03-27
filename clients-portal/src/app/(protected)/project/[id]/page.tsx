import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ProjectClientView } from "./ProjectClientView";

export const revalidate = 0;

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch Project
  const { data: project, error: projError } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (projError || !project) {
    return notFound();
  }

  // 2. Fetch Timeline Events
  const { data: events, error: evError } = await supabase
    .from("events")
    .select("*")
    .eq("project_id", id)
    .order("created_at", { ascending: false });

  // 3. Find the most recent audio file and generate a temporary signed URL for streaming
  const latestAudioEvent = events?.find(e => e.audio_url !== null && e.audio_url !== "");
  let activeAudioUrl = "";

  if (latestAudioEvent?.audio_url) {
    if (latestAudioEvent.audio_url.startsWith("http")) {
      // It's a direct URL to the cPanel web host!
      activeAudioUrl = latestAudioEvent.audio_url;
    } else {
      // Legacy Supabase Storage link
      const { data: signedUrlData } = await supabase.storage
        .from("secure-audio")
        .createSignedUrl(latestAudioEvent.audio_url, 3600); // 1 hour expiry
      
      if (signedUrlData) {
        activeAudioUrl = signedUrlData.signedUrl;
      }
    }
  }

  return (
    <ProjectClientView 
      project={project} 
      events={events || []} 
      activeAudioUrl={activeAudioUrl} 
    />
  );
}
