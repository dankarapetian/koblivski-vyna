import type { NextConfig } from "next";
import { createSecurityHeaders } from "@/lib/security";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store, max-age=0" },
          { key: "Pragma", value: "no-cache" },
        ],
      },
      {
        source: "/(.*)",
        headers: createSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
