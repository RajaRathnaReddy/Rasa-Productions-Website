import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { motion } from "framer-motion";

export default function Home() {
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
    </div>
  );
}
