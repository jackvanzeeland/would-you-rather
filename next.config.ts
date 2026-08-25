import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root explicitly — this project lives inside an iCloud
  // Drive tree that also contains an unrelated package-lock.json further up,
  // which Turbopack would otherwise (harmlessly) warn about.
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
