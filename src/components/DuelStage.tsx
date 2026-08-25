"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CATEGORY_THEMES } from "@/lib/theme";
import { shareQuestion } from "@/lib/share";
import type { OptionKey, Question } from "@/lib/types";
import { AUTO_ADVANCE_MS } from "./GameApp";
import OptionPanel from "./OptionPanel";
import OrBadge from "./OrBadge";
import ThemeToggle from "./ThemeToggle";

const RING_RADIUS = 12;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface Props {
  question: Question;
  picked: OptionKey | null;
  round: number;
  poolSize: number;
  entryKey: number;
  onPick: (key: OptionKey) => void;
  onSkip: () => void;
  onNext: () => void;
  onOpenSettings: () => void;
}

export default function DuelStage({
  question,
  picked,
  round,
  poolSize,
  entryKey,
  onPick,
  onSkip,
  onNext,
  onOpenSettings,
}: Props) {
  const theme = CATEGORY_THEMES[question.category];
  const [shareNote, setShareNote] = useState<string | null>(null);

  useEffect(() => {
    if (!shareNote) return;
    const id = setTimeout(() => setShareNote(null), 1800);
    return () => clearTimeout(id);
  }, [shareNote]);

  async function handleShare() {
    const result = await shareQuestion(question);
    if (result === "copied") setShareNote("Copied!");
    else if (result === "failed") setShareNote("Couldn't share");
    // "shared" and "cancelled" need no toast — the share sheet was the feedback.
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-line">
            <Image
              src="/logo.jpeg"
              alt=""
              width={64}
              height={64}
              className="h-full w-full scale-125 object-cover"
            />
          </div>
          <span
            className="rounded-full px-3 py-1 font-mono text-xs font-semibold tracking-[0.15em] uppercase"
            style={{ background: theme.accentSoft, color: theme.accent }}
          >
            {question.category}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-text-soft sm:inline">
            round {String(round + 1).padStart(2, "0")}
          </span>

          <ThemeToggle />

          <div className="relative">
            <button
              type="button"
              onClick={handleShare}
              aria-label="Share this dilemma"
              className="cursor-pointer rounded-full border border-line p-2 text-text-soft transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M18 8a3 3 0 100-6 3 3 0 000 6zM6 15a3 3 0 100-6 3 3 0 000 6zM18 22a3 3 0 100-6 3 3 0 000 6z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M8.6 13.5l6.8-3.9M8.6 10.5l6.8 3.9"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            {shareNote && (
              <span
                role="status"
                className="absolute top-full right-0 mt-1.5 rounded-full bg-surface px-2.5 py-1 font-mono text-[10px] whitespace-nowrap text-text-soft ring-1 ring-line"
              >
                {shareNote}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onOpenSettings}
            aria-label="Change categories"
            className="cursor-pointer rounded-full border border-line p-2 text-text-soft transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 15a3 3 0 100-6 3 3 0 000 6z"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Announces each new dilemma to screen readers; the panels themselves
          remount for the entry animation and would otherwise change silently. */}
      <p aria-live="polite" className="sr-only">
        Would you rather {question.option1}, or {question.option2}?
      </p>

      <div className="grid flex-1 grid-rows-[1fr_auto_1fr] gap-3 sm:grid-cols-[1fr_auto_1fr] sm:grid-rows-1 sm:gap-5">
        <OptionPanel
          label={question.option1}
          side="left"
          active={picked === "option1"}
          dimmed={picked !== null && picked !== "option1"}
          disabled={picked !== null}
          onSelect={() => onPick("option1")}
          entryKey={entryKey}
        />
        <OrBadge entryKey={entryKey} />
        <OptionPanel
          label={question.option2}
          side="right"
          active={picked === "option2"}
          dimmed={picked !== null && picked !== "option2"}
          disabled={picked !== null}
          onSelect={() => onPick("option2")}
          entryKey={entryKey}
        />
      </div>

      <div className="mt-8 flex flex-col items-center gap-2">
        {picked ? (
          <button
            type="button"
            onClick={onNext}
            aria-label="Next question now"
            title="Next question now"
            className="flex h-11 cursor-pointer items-center justify-center rounded-full p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" className="-rotate-90" aria-hidden>
              <circle
                cx="16"
                cy="16"
                r={RING_RADIUS}
                stroke="var(--line)"
                strokeWidth="3"
                fill="none"
              />
              <circle
                cx="16"
                cy="16"
                r={RING_RADIUS}
                stroke={theme.accent}
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={RING_CIRCUMFERENCE}
                className="anim-ring"
                style={{ animationDuration: `${AUTO_ADVANCE_MS}ms` }}
              />
            </svg>
          </button>
        ) : (
          <div className="flex h-11 items-center justify-center">
            <button
              type="button"
              onClick={onSkip}
              className="cursor-pointer rounded-full border border-line px-6 py-2.5 font-semibold text-text-soft transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Skip this one
            </button>
          </div>
        )}
        <p className="hidden font-mono text-xs text-text-soft/70 sm:block">
          ← → or 1 2 to choose · S to skip · {poolSize} in the deck
        </p>
        <p className="font-mono text-xs text-text-soft/70 sm:hidden">
          {poolSize} in the deck
        </p>
      </div>
    </div>
  );
}
