"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { QUESTIONS } from "@/lib/data";
import { CATEGORY_ORDER } from "@/lib/theme";
import { shuffle } from "@/lib/shuffle";
import type { CategoryName, OptionKey, Question } from "@/lib/types";
import CategoryPicker from "./CategoryPicker";
import DuelStage from "./DuelStage";

type Phase = "setup" | "playing";

export default function GameApp() {
  const [phase, setPhase] = useState<Phase>("setup");
  const [selected, setSelected] = useState<Set<CategoryName>>(
    () => new Set(CATEGORY_ORDER)
  );
  const [current, setCurrent] = useState<Question | null>(null);
  const [picked, setPicked] = useState<OptionKey | null>(null);
  const [round, setRound] = useState(0);
  const [entryKey, setEntryKey] = useState(0);
  const [hasPlayedBefore, setHasPlayedBefore] = useState(false);

  const queueRef = useRef<Question[]>([]);

  const pool = useMemo(
    () => QUESTIONS.filter((q) => selected.has(q.category)),
    [selected]
  );

  const advance = useCallback(() => {
    if (pool.length === 0) return;
    if (queueRef.current.length === 0) {
      const deck = shuffle(pool);
      // A fresh deck contains the question still on screen — make sure it
      // isn't the very next card, or it would show twice in a row.
      if (deck.length > 1 && deck[deck.length - 1] === current) {
        const j = Math.floor(Math.random() * (deck.length - 1));
        [deck[deck.length - 1], deck[j]] = [deck[j], deck[deck.length - 1]];
      }
      queueRef.current = deck;
    }
    const next = queueRef.current.pop() ?? null;
    setCurrent(next);
    setPicked(null);
    setEntryKey((k) => k + 1);
  }, [pool, current]);

  function toggleCategory(name: CategoryName) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function startGame() {
    if (pool.length === 0) return;
    queueRef.current = shuffle(pool);
    setRound(0);
    setHasPlayedBefore(true);
    setPhase("playing");
    advance();
  }

  function handlePick(key: OptionKey) {
    if (picked) return;
    setPicked(key);
  }

  function handleNext() {
    setRound((r) => r + 1);
    advance();
  }

  function handleDecide() {
    if (picked) return;
    handlePick(Math.random() < 0.5 ? "option1" : "option2");
  }

  useEffect(() => {
    if (phase !== "playing") return;

    function onKeyDown(e: KeyboardEvent) {
      // Leave browser chords (⌘S, ⌘D, ⌘1…) alone.
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === "ArrowLeft" || e.key === "1") {
        if (!picked) handlePick("option1");
      } else if (e.key === "ArrowRight" || e.key === "2") {
        if (!picked) handlePick("option2");
      } else if (e.key.toLowerCase() === "s") {
        if (!picked) advance();
      } else if (e.key.toLowerCase() === "d") {
        if (!picked) handleDecide();
      } else if (e.key === "Enter" || e.key === " ") {
        // A focused control (theme, share, settings, Next) keeps its own
        // Enter/Space activation; the shortcut only fires from the page.
        const target = e.target as HTMLElement | null;
        if (target?.closest("button, a, input, select, textarea, [role='button']")) return;
        if (picked) {
          e.preventDefault();
          handleNext();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, picked, advance]);

  if (phase === "setup" || !current) {
    return (
      <CategoryPicker
        selected={selected}
        onToggle={toggleCategory}
        onSelectAll={() => setSelected(new Set(CATEGORY_ORDER))}
        onSelectNone={() => setSelected(new Set())}
        poolSize={pool.length}
        onStart={startGame}
        hasPlayedBefore={hasPlayedBefore}
      />
    );
  }

  return (
    <DuelStage
      question={current}
      picked={picked}
      round={round}
      poolSize={pool.length}
      entryKey={entryKey}
      onPick={handlePick}
      onSkip={advance}
      onNext={handleNext}
      onDecide={handleDecide}
      onOpenSettings={() => setPhase("setup")}
    />
  );
}
