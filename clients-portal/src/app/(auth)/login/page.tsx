import { LoginForm } from "@/components/auth/LoginForm";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 relative">
      <AnimatedBackground />
      <div className="relative z-10 w-full max-w-md">
        <div className="flex justify-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/logo.png" alt="Rasa Productions" className="h-28 md:h-36 w-auto object-contain drop-shadow-[0_0_30px_rgba(255,160,0,0.25)] hover:scale-105 transition-transform duration-500" />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
