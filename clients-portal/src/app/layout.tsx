import type { Metadata, Viewport } from "next";
import { Outfit, Noto_Sans_Telugu, Geist_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  variable: "--font-noto-telugu",
  subsets: ["telugu"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rasa Productions — Client Portal",
    template: "%s | Rasa Productions",
  },
  description:
    "Your private studio collaboration space. Stream your mixes, leave timestamped feedback, and track every stage of your music production with Rasa Productions.",
  keywords: ["Rasa Productions", "music studio", "client portal", "mixing", "mastering", "music production"],
  authors: [{ name: "Rasa Productions", url: "https://rasaproductions.in" }],
  creator: "Rasa Productions",
  metadataBase: new URL("https://rasaproductions.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://rasaproductions.in",
    siteName: "Rasa Productions Studio Portal",
    title: "Rasa Productions — Exclusive Client Portal",
    description:
      "Access your mixes, give feedback, and track your project — all in one private studio space.",
    images: [
      {
        url: "/media/logo.png",
        width: 512,
        height: 512,
        alt: "Rasa Productions Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rasa Productions — Client Portal",
    description: "Your private music production studio workspace.",
    images: ["/media/logo.png"],
  },
  icons: {
    icon: [
      { url: "/media/logo.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/media/logo.png",
    shortcut: "/media/logo.png",
  },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#080812",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
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
