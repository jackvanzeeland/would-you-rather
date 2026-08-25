"use client";

interface Props {
  entryKey: number;
}

export default function OrBadge({ entryKey }: Props) {
  return (
    <div className="flex items-center justify-center py-1 sm:px-2 sm:py-0">
      <div
        key={entryKey}
        className="anim-pop or-badge-ring flex h-14 w-14 shrink-0 items-center justify-center rounded-full p-[2px]"
      >
        <div className="flex h-full w-full items-center justify-center rounded-full bg-bg font-display text-sm font-extrabold tracking-wide text-text-soft">
          OR
        </div>
      </div>
    </div>
  );
}
