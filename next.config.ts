import path from "node:path";
import type { NextConfig } from "next";
import { withSerwist } from "@serwist/turbopack";

const nextConfig: NextConfig = withSerwist({
  // Pin the workspace root explicitly — this project lives inside an iCloud
  // Drive tree that also contains an unrelated package-lock.json further up,
  // which Turbopack would otherwise (harmlessly) warn about.
  turbopack: {
    root: path.resolve(__dirname),
  },
  experimental: {
    // Connectivity-aware retries for soft navigations/Server Actions. Full
    // cold-load offline support comes from the Serwist service worker
    // (withSerwist above) — these two are complementary, not redundant.
    useOffline: true,
  },
});

export default nextConfig;
