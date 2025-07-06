import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['moment-timezone'],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Any other Next.js config options
};

export default nextConfig;