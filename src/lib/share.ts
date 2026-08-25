import type { Question } from "./types";

export type ShareResult = "shared" | "cancelled" | "copied" | "failed";

function shareText(q: Question): string {
  return `Would you rather ${q.option1}, or ${q.option2}? 🤔`;
}

/**
 * Shares a single dilemma via the Web Share API where available (mobile
 * browsers), falling back to copying the text to the clipboard. Never
 * records or transmits which option was picked — only the question text.
 */
export async function shareQuestion(q: Question): Promise<ShareResult> {
  const text = shareText(q);

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ text, title: "Would You Rather" });
      return "shared";
    } catch (err) {
      // A dismissed share sheet is a choice, not a failure — don't touch
      // the clipboard for it.
      if (err instanceof DOMException && err.name === "AbortError") {
        return "cancelled";
      }
      // The API rejected for real — fall through to clipboard so the
      // action still does something useful.
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return "copied";
    } catch {
      return "failed";
    }
  }

  return "failed";
}
