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
        hostname: "flowin-pi.vercel.app",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "stage.felowin.ir",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "stage.felowin.ir",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
