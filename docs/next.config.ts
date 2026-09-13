import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Workaround for Next.js 16 global-error prerender bug on Vercel
  experimental: {
    staticGenerationRetryCount: 3,
  },
};

export default nextConfig;
