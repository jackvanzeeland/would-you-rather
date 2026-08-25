"use client";

import { useOffline } from "next/offline";

// `useOffline` is Next's own connectivity-aware leaf hook (next/offline) —
// it returns `false` during SSR/pre-hydration and flips to the real value
// once the client mounts, the same "safe default, then sync" shape as
// ThemeToggle's useSyncExternalStore usage. It requires
// `experimental.useOffline` in next.config.ts to do anything; without that
// flag it always returns `false`.
export default function OfflineBanner() {
  const isOffline = useOffline();

  if (!isOffline) return null;

  return (
    <div
      role="status"
      className="border-b border-line bg-surface-2 px-4 py-2 text-center text-sm text-text-soft"
    >
      Offline. Pending requests will retry once you&apos;re back online.
    </div>
  );
}
