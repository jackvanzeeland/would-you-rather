"use client";

import { useSyncExternalStore } from "react";

type Mode = "dark" | "light";

const STORAGE_KEY = "wyr-theme";
const THEME_COLOR: Record<Mode, string> = { dark: "#191a1f", light: "#f7f6fc" };

function getSnapshot(): Mode {
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

// The server (and the pre-hydration client) always renders the dark
// default; a blocking <head> script flips the DOM attribute before paint
// if a returning visitor saved "light", and this store picks that up.
function getServerSnapshot(): Mode {
  return "dark";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function applyMode(mode: Mode) {
  document.documentElement.setAttribute("data-theme", mode);
  window.localStorage.setItem(STORAGE_KEY, mode);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[mode]);
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    applyMode(mode === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`cursor-pointer rounded-full border border-line p-2 text-text-soft transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      {mode === "dark" ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M21.5 12h-2.2M4.7 12H2.5M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6M18.5 18.5l-1.6-1.6M7.1 7.1L5.5 5.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M20 14.2A8.5 8.5 0 1110.3 4a6.7 6.7 0 009.7 10.2z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
