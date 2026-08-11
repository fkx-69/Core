import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["test.mycore.work"],
  serverExternalPackages: ["better-sqlite3", "@maxmind/geoip2-node"],
  images: {
    qualities: [75, 95],
  },
};

export default nextConfig;
