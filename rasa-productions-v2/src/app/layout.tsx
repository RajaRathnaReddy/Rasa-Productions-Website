import type { Metadata } from "next";
import { Inter, Rajdhani } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import FloatingPlayer from "@/components/FloatingPlayer";
import BackgroundMusic from "@/components/BackgroundMusic";
import LoadingScreen from "@/components/LoadingScreen";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";
import InteractiveBackground from "@/components/InteractiveBackground";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "Rasa Productions | Music. Emotion. Story.",
  description:
    "Rasa Productions is a professional music and virtual production brand crafting cinematic experiences through music, video, and Unreal Engine environments.",
  keywords: [
    "Rasa Productions",
    "Indian music",
    "Telugu music",
    "Christian music",
    "virtual production",
    "cinematic music",
  ],
  openGraph: {
    title: "Rasa Productions | Music. Emotion. Story.",
    description:
      "Discover our music, video songs and virtual production work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${rajdhani.variable}`}>
      <body className="bg-black text-white antialiased overflow-x-hidden cursor-none">
        <CustomCursor />
        <InteractiveBackground />

        <LoadingScreen />
        <BackgroundMusic />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
        <FloatingPlayer />
      </body>
    </html>
  );
}
