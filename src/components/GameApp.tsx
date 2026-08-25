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
      queueRef.current = shuffle(pool);
    }
    const next = queueRef.current.pop() ?? null;
    setCurrent(next);
    setPicked(null);
    setEntryKey((k) => k + 1);
  }, [pool]);

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
    const next = queueRef.current.pop() ?? null;
    setCurrent(next);
    setPicked(null);
    setEntryKey((k) => k + 1);
    setPhase("playing");
  }

  function handlePick(key: OptionKey) {
    if (picked) return;
    setPicked(key);
    setRound((r) => r + 1);
  }

  function handleDecide() {
    if (picked) return;
    handlePick(Math.random() < 0.5 ? "option1" : "option2");
  }

  useEffect(() => {
    if (phase !== "playing") return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "1") {
        if (!picked) handlePick("option1");
      } else if (e.key === "ArrowRight" || e.key === "2") {
        if (!picked) handlePick("option2");
      } else if (e.key.toLowerCase() === "s") {
        if (!picked) advance();
      } else if (e.key.toLowerCase() === "d") {
        if (!picked) handleDecide();
      } else if (e.key === "Enter" || e.key === " ") {
        if (picked) {
          e.preventDefault();
          advance();
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
      onNext={advance}
      onDecide={handleDecide}
      onOpenSettings={() => setPhase("setup")}
    />
  );
}
