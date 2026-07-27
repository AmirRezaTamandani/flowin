import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/form",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/form",
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn-images.archybase.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "flowin-pi.vercel.app",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
