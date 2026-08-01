import type { NextConfig } from "next";
import { createSecurityHeaders } from "@/lib/security";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: createSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
