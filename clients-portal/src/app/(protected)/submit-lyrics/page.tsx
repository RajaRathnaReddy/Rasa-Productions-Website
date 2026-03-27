"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Music2, Send, CheckCircle2 } from "lucide-react";
import { MOCK_PROJECTS } from "@/lib/mock-data";

export default function SubmitLyricsPage() {
  const [selectedProject, setSelectedProject] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject || !lyrics) return;
    
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setLyrics("");
    }, 1500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-16 pt-8">
      <div className="mb-8 text-center space-y-4">
        <div className="w-16 h-16 bg-white/60 rounded-full flex items-center justify-center mx-auto border border-white/80 shadow-md backdrop-blur-md">
          <Music2 className="w-8 h-8 text-indigo-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800">
          Submit <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500 drop-shadow-sm">Lyrics.</span>
        </h1>
        <p className="text-lg text-slate-600 font-light max-w-xl mx-auto">
          Finalized your writing session? Submit your drafted lyrics here so we can prep them for vocal tracking.
        </p>
      </div>

      {isSuccess ? (
        <Card className="border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-hidden">
          <CardContent className="pt-12 pb-12 text-center flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 bg-emerald-100/50 rounded-full flex items-center justify-center border border-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-800">Lyrics Submitted Successfully!</h2>
              <p className="text-slate-600 max-w-md mx-auto">We've received your lyrics for the selected project. The producer has been notified and we'll format them for the tracking session.</p>
            </div>
            <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-8 bg-white/50 border-white/80 text-slate-700 hover:bg-white transition-all shadow-sm">
              Submit Another
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-white/60 bg-white/40 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] overflow-hidden">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1 bg-white/20 border-b border-white/40">
              <CardTitle className="text-xl tracking-tight text-slate-800">Lyrics Submission Form</CardTitle>
              <CardDescription className="text-slate-500">
                Please ensure these are the final approved lyrics before sending.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              
              <div className="space-y-3">
                <Label htmlFor="project" className="text-slate-700 font-medium ml-1">Select Project</Label>
                <select 
                  id="project"
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="flex h-12 w-full items-center justify-between rounded-xl border border-white/60 bg-white/50 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 backdrop-blur-md shadow-sm transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>-- Choose a project --</option>
                  {MOCK_PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>{p.songTitle} - {p.projectTitle}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <Label htmlFor="lyrics" className="text-slate-700 font-medium ml-1">Paste Lyrics</Label>
                <Textarea
                  id="lyrics"
                  placeholder="[Verse 1]&#10;Write your lyrics here..."
                  className="min-h-[300px] bg-white/50 border-white/60 focus-visible:bg-white/80 text-slate-800 placeholder:text-slate-400 rounded-xl resize-y p-4 shadow-inner"
                  value={lyrics}
                  onChange={(e) => setLyrics(e.target.value)}
                  required
                />
              </div>

            </CardContent>
            <CardFooter className="bg-white/20 border-t border-white/40 pt-6 pb-6">
              <Button type="submit" disabled={isSubmitting || !selectedProject || !lyrics} className="w-full bg-indigo-500 hover:bg-indigo-600 text-white shadow-md h-12 rounded-xl text-md font-medium transition-all group">
                {isSubmitting ? "Sending..." : (
                  <span className="flex items-center gap-2">
                    Submit Final Lyrics <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
}
