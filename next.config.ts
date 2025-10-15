import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  eslint: {
    // Run ESLint during builds to catch errors
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Ignore TypeScript errors during production builds (optional)
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
