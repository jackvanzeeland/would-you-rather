"use client";

interface Props {
  label: string;
  side: "left" | "right";
  active: boolean;
  dimmed: boolean;
  disabled: boolean;
  onSelect: () => void;
  entryKey: number;
}

export default function OptionPanel({
  label,
  side,
  active,
  dimmed,
  disabled,
  onSelect,
  entryKey,
}: Props) {
  const panelClass = side === "left" ? "duel-panel-a" : "duel-panel-b";
  const slideClass = side === "left" ? "anim-slide-left" : "anim-slide-right";
  const checkBg = side === "left" ? "var(--side-a)" : "var(--side-b)";

  return (
    <button
      key={entryKey}
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={active}
      className={`${panelClass} ${slideClass} ${active ? "is-active" : ""} group relative flex min-h-40 flex-1 cursor-pointer items-center justify-center overflow-hidden rounded-3xl p-8 text-center transition-[transform,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent sm:min-h-0 ${
        active ? "scale-[1.02]" : ""
      } ${dimmed ? "scale-[0.98] opacity-35" : "hover:-translate-y-1"} ${
        disabled && !active ? "cursor-default" : ""
      }`}
    >
      <span className="font-display text-2xl leading-tight font-bold text-balance sm:text-3xl">
        {label}
      </span>

      {active && (
        <span
          aria-hidden
          style={{ background: checkBg }}
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
        >
          ✓
        </span>
      )}
    </button>
  );
}
