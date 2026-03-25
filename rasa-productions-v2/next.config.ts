import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'export',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/wp-content/themes/RasaProduction-v2' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
