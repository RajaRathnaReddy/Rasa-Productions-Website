import type { Metadata } from "next";
import { Outfit, Noto_Sans_Telugu, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const notoTelugu = Noto_Sans_Telugu({
  variable: "--font-noto-telugu",
  subsets: ["telugu"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rasa Productions | Client Portal",
  description: "Secure, premium client collaboration portal for music production.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${notoTelugu.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary">
        <main className="flex-1 flex flex-col relative">{children}</main>
      </body>
    </html>
  );
}
