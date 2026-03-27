import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, AlertCircle } from "lucide-react";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";

export const revalidate = 30;

export default async function Home() {
  // Read site settings for the contact banner
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("contact_banner_enabled, contact_email_primary, contact_email_secondary, contact_phone")
    .eq("id", 1)
    .single();

  const bannerEnabled = settings?.contact_banner_enabled ?? false;

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 overflow-hidden">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-4xl mx-auto text-center space-y-10 animate-in fade-in zoom-in-95 duration-1000">
        <div className="flex justify-center mb-8 relative">
          <div className="absolute inset-0 bg-primary/30 blur-[100px] rounded-full w-[300px] h-[300px] mx-auto opacity-60 animate-pulse" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/media/logo.png" 
            alt="Rasa Productions" 
            className="w-auto h-32 md:h-48 relative z-10 drop-shadow-[0_0_35px_rgba(255,160,0,0.6)] hover:scale-110 transition-transform duration-700" 
          />
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white drop-shadow-xl">
          Exclusive Client <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-amber-300 to-primary/80">
            Collaboration Portal
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80 font-medium leading-relaxed drop-shadow-md">
          Welcome to your private studio space. Access your mixes, review masters, and securely stream your work-in-progress audio with Rasa Productions.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Link href="/login">
            <Button size="lg" className="h-16 px-10 rounded-full text-lg shadow-[0_0_40px_rgba(255,160,0,0.4)] hover:-translate-y-2 hover:shadow-[0_0_60px_rgba(255,160,0,0.6)] transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground font-bold border border-amber-300/50">
              Access Private Portal <ArrowRight className="ml-2 w-6 h-6 animate-pulse" />
            </Button>
          </Link>
          <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all shadow-xl font-bold">
            Learn More
          </Button>
        </div>
      </div>

      {/* ── CONTACT BANNER ── Server-controlled toggle */}
      {bannerEnabled && settings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d1a]/96 backdrop-blur-xl border-t border-amber-500/20 shadow-[0_-4px_24px_rgba(245,158,11,0.12)]">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
            <div className="flex items-center gap-2 text-amber-300/80 font-semibold shrink-0">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              Having issues? Contact us:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href={`mailto:${settings.contact_email_primary}`}
                className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-xs">{settings.contact_email_primary}</span>
              </a>
              <a
                href={`mailto:${settings.contact_email_secondary}`}
                className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-xs">{settings.contact_email_secondary}</span>
              </a>
              <a
                href={`tel:${settings.contact_phone}`}
                className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-xs">{settings.contact_phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
