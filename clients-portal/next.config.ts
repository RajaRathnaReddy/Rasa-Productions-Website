import type { NextConfig } from "next";

const securityHeaders = [
  // Prevent browsers from MIME-sniffing away from the declared content-type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Stop site being embedded in iframes (clickjacking protection)
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Force HTTPS for 1 year, include subdomains
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  // Control referrer info sent when navigating away
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features not needed by this app
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  // Content Security Policy — controls where scripts/styles/media can be loaded from
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Next.js needs unsafe-inline for inline styles; restrict scripts
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      // Allow images from Supabase storage and the app itself
      "img-src 'self' data: blob: https://*.supabase.co https://storage.rasaproductions.in",
      // Audio streams from Google Drive (via our own proxy) and any Supabase storage
      "media-src 'self' blob: https://*.googleapis.com https://*.supabase.co https://storage.rasaproductions.in",
      // Allow Supabase WebSocket for real-time + fetch
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.resend.com https://*.googleapis.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Apply security headers to every route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Image optimisation: allow Supabase hosted images
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "storage.rasaproductions.in" },
    ],
  },
};

export default nextConfig;
