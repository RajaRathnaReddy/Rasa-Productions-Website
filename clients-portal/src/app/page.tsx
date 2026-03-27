import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Phone, AlertCircle, MessageCircle } from "lucide-react";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";

export const revalidate = 30;

// Default contact info (used when site_settings table doesn't exist yet)
const DEFAULT_CONTACT = {
  contact_email_primary: "Hello@rasaproductions.in",
  contact_email_secondary: "a.rajarathnareddychennai@gmail.com",
  contact_phone: "9133777017",
  contact_banner_enabled: false,
};

export default async function Home() {
  // Read site settings — gracefully fall back to defaults if table doesn't exist yet
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("contact_banner_enabled, contact_email_primary, contact_email_secondary, contact_phone")
    .eq("id", 1)
    .single();

  const contact = settings ?? DEFAULT_CONTACT;
  const bannerEnabled = contact.contact_banner_enabled;
  const emailPrimary   = contact.contact_email_primary   ?? DEFAULT_CONTACT.contact_email_primary;
  const emailSecondary = contact.contact_email_secondary ?? DEFAULT_CONTACT.contact_email_secondary;
  const phone          = contact.contact_phone           ?? DEFAULT_CONTACT.contact_phone;

  return (
    <div className="relative flex flex-col overflow-hidden">
      <AnimatedBackground />

      {/* ── HERO ── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
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
            {/* Learn More — scrolls to the contact section below */}
            <a href="#contact">
              <Button variant="outline" size="lg" className="h-16 px-10 rounded-full text-lg border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all shadow-xl font-bold">
                <MessageCircle className="mr-2 w-5 h-5" /> Contact Us
              </Button>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      </section>

      {/* ── CONTACT SECTION ── Always visible on homepage */}
      <section id="contact" className="relative z-10 w-full py-20 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-10">
          {/* Header */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-widest">
              <AlertCircle className="w-3.5 h-3.5" /> Get in Touch
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Reach <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Rasa Productions</span>
            </h2>
            <p className="text-white/50 text-base max-w-md mx-auto leading-relaxed">
              Have questions about your project, invoices, or the studio process? We&apos;re always available.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Email 1 */}
            <a
              href={`mailto:${emailPrimary}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-amber-500/8 hover:border-amber-500/25 transition-all duration-200 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all">
                <Mail className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Studio Email</p>
                <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors break-all">{emailPrimary}</p>
              </div>
            </a>

            {/* Email 2 */}
            <a
              href={`mailto:${emailSecondary}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-indigo-500/8 hover:border-indigo-500/25 transition-all duration-200 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all">
                <Mail className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Direct Email</p>
                <p className="text-sm font-semibold text-white/80 group-hover:text-white transition-colors break-all">{emailSecondary}</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href={`tel:${phone}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl border border-white/8 bg-white/[0.03] hover:bg-emerald-500/8 hover:border-emerald-500/25 transition-all duration-200 text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(52,211,153,0.25)] transition-all">
                <Phone className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Phone / WhatsApp</p>
                <p className="text-2xl font-black text-white group-hover:text-emerald-300 transition-colors">{phone}</p>
              </div>
            </a>
          </div>

          {/* CTA */}
          <Link href="/login">
            <Button size="lg" className="h-14 px-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-black text-base shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_50px_rgba(245,158,11,0.55)] transition-all border border-amber-300/30">
              Access Your Portal <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── STICKY CONTACT BANNER (Admin-controlled toggle) ── */}
      {bannerEnabled && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d1a]/96 backdrop-blur-xl border-t border-amber-500/20 shadow-[0_-4px_24px_rgba(245,158,11,0.12)]">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
            <div className="flex items-center gap-2 text-amber-300/80 font-semibold shrink-0">
              <AlertCircle className="w-4 h-4 text-amber-400" /> Having issues? Contact us:
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href={`mailto:${emailPrimary}`} className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-xs">{emailPrimary}</span>
              </a>
              <a href={`mailto:${emailSecondary}`} className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-xs">{emailSecondary}</span>
              </a>
              <a href={`tel:${phone}`} className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-mono text-xs">{phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
