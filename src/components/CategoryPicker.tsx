"use client";

import Image from "next/image";
import { CATEGORY_ORDER, CATEGORY_THEMES } from "@/lib/theme";
import type { CategoryName } from "@/lib/types";
import ThemeToggle from "./ThemeToggle";

interface Props {
  selected: Set<CategoryName>;
  onToggle: (name: CategoryName) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  poolSize: number;
  onStart: () => void;
  hasPlayedBefore: boolean;
}

export default function CategoryPicker({
  selected,
  onToggle,
  onSelectAll,
  onSelectNone,
  poolSize,
  onStart,
  hasPlayedBefore,
}: Props) {
  const canStart = poolSize > 0;

  return (
    <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="anim-pop h-14 w-14 overflow-hidden rounded-full ring-2 ring-line">
        <Image
          src="/logo.jpeg"
          alt=""
          width={112}
          height={112}
          priority
          className="h-full w-full scale-125 object-cover"
        />
      </div>

      <p className="anim-rise mt-5 font-mono text-xs tracking-[0.25em] text-text-soft uppercase [animation-delay:0.05s]">
        943 dilemmas · 7 categories
      </p>

      <h1 className="anim-rise mt-4 font-display text-6xl leading-[0.95] font-extrabold tracking-tight sm:text-7xl [animation-delay:0.1s]">
        Would you
        <br />
        <span className="relative inline-block">
          rather
          <svg aria-hidden viewBox="0 0 200 20" className="absolute -bottom-2 left-0 w-full">
            <defs>
              <linearGradient id="underline-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--side-a)" />
                <stop offset="1" stopColor="var(--side-b)" />
              </linearGradient>
            </defs>
            <path
              d="M2 14 C 50 4, 150 4, 198 14"
              fill="none"
              stroke="url(#underline-gradient)"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
        </span>
        ?
      </h1>

      <p className="anim-rise mt-6 max-w-md text-balance text-text-soft [animation-delay:0.15s]">
        Pick a side. There&apos;s no wrong answer — just the one you&apos;d
        actually live with.
      </p>

      <div className="anim-rise mt-10 w-full [animation-delay:0.2s]">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-xs tracking-[0.2em] text-text-soft uppercase">
            Pick your categories
          </span>
          <div className="flex gap-3 font-mono text-xs">
            <button
              type="button"
              onClick={onSelectAll}
              className="text-text-soft underline decoration-line underline-offset-4 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              all
            </button>
            <button
              type="button"
              onClick={onSelectNone}
              className="text-text-soft underline decoration-line underline-offset-4 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              none
            </button>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {CATEGORY_ORDER.map((name) => {
            const theme = CATEGORY_THEMES[name];
            const active = selected.has(name);
            return (
              <button
                key={name}
                type="button"
                onClick={() => onToggle(name)}
                aria-pressed={active}
                style={
                  active
                    ? { background: theme.accent, borderColor: theme.accent }
                    : { borderColor: "var(--line)" }
                }
                className="cursor-pointer rounded-full border-2 px-4 py-2 text-sm font-semibold transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                <span className={active ? "text-white" : "text-text-soft"}>
                  {name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="anim-rise mt-10 [animation-delay:0.25s]">
        <button
          type="button"
          onClick={onStart}
          disabled={!canStart}
          className="cursor-pointer rounded-full bg-text px-10 py-4 font-display text-lg font-bold tracking-tight text-bg transition-transform duration-150 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          {hasPlayedBefore ? "Start a new round" : "Start the duel"} →
        </button>
        <p className="mt-3 h-4 font-mono text-xs text-text-soft">
          {canStart
            ? `${poolSize} dilemmas in play`
            : "Select at least one category to start"}
        </p>
      </div>
    </div>
  );
}
