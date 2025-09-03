import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow LAN dev origin to avoid cross-origin dev warning
  experimental: {
    allowedDevOrigins: [
      "http://192.168.1.34:3000"
    ],
    optimizePackageImports: ["react", "react-dom"]
  }
};

export default nextConfig;
