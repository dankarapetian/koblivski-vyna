import type { NextConfig } from "next";
import { createSecurityHeaders } from "@/lib/security";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/terms",
        destination: "/",
        permanent: true,
      },
    ];
  },
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
        source: "/privacy",
        headers: [{ key: "X-Robots-Tag", value: "noindex, follow" }],
      },
      {
        source: "/(.*)",
        headers: createSecurityHeaders(),
      },
    ];
  },
};

export default nextConfig;
