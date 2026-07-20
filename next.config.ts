import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/form",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/form",
  },
};

export default nextConfig;
