import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/customer_form",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/customer_form",
  },
};

export default nextConfig;
