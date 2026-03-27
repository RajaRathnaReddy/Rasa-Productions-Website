import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center gap-4 animate-in fade-in duration-500">
      <div className="relative">
        {/* Pulsing glow behind spinner */}
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
        <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
      </div>
      <p className="text-muted-foreground uppercase tracking-widest text-sm font-medium animate-pulse">
        Loading Data...
      </p>
    </div>
  );
}
