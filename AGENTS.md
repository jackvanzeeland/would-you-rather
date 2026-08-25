<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes (Would You Rather)

Learnings from building this out — read before making structural changes.

## Data

- `data/questions.json` is the single source of truth: a flat array of
  `{ option1, option2, category }`. The app imports it directly
  (`src/lib/data.ts`) via a relative path from `src/`, not a copy inside `src/`.
- The 7 categories are fixed and must match exactly (used as literal strings
  in the data, and as keys in `CATEGORY_ORDER`/`CATEGORY_THEMES` in
  `src/lib/theme.ts`): `Deep Thoughts`, `Family`, `Friends`, `Dating`,
  `Occupation`, `Dreams`, `Recreation`.
- `data/raw/<category>/` holds the raw source pages each category was
  scraped from, kept locally for provenance but **gitignored** — don't expect
  it to be there on a fresh clone. `docs/screenshots/` is the opposite: those
  ARE committed (used by the README), don't gitignore that path.
- No tracking of any kind — explicit user requirement. Don't add analytics,
  pick history, or stats. The only thing ever persisted client-side is the
  dark/light theme preference (`localStorage: wyr-theme`).

## Design system

- The whole visual identity is derived from `public/logo.jpeg` (a question
  mark split blue/red down the middle, glowing on near-black) — that's why
  the duel panels are literally blue-left/red-right rather than a generic
  split. If the design evolves, keep deriving from that logo rather than
  drifting toward generic defaults (warm-cream light / near-black+neon dark
  are both explicitly what this design avoided being confused with).
- Dark is the default theme; light is opt-in via `ThemeToggle`
  (`data-theme="light"` attribute on `<html>`, values in
  `src/app/globals.css`). Category accent colors (`src/lib/theme.ts`) are
  independent of the dark/light palette and don't need changes when tuning
  either theme.
- `ThemeToggle` reads state with `useSyncExternalStore` (not
  `useState`+`useEffect`) — this project's eslint config
  (`react-hooks/set-state-in-effect`) rejects synchronous `setState` inside
  effects, and this pattern is the correct fix for "sync React state from a
  DOM attribute" rather than suppressing the rule.
- Any theme-affecting attribute set before hydration (the FOUC-prevention
  script in `layout.tsx`, `strategy="beforeInteractive"`) needs
  `suppressHydrationWarning` on the element it mutates (`<html>` here), or
  React logs a hydration-mismatch error even though behavior is correct.

## Environment quirks

- This repo lives inside iCloud Drive with a path containing spaces
  (`Would You Rather`). `create-next-app` refuses to scaffold directly into
  it (npm naming rules reject spaces/capitals) — scaffold into a temp dir
  with a valid name, `rsync` the generated files in, then fix
  `package.json`'s `"name"` by hand.
- `next.config.ts` pins `turbopack.root` explicitly — there's an unrelated
  `package-lock.json` further up this iCloud tree (outside this git repo)
  that otherwise makes Turbopack print a workspace-root warning on every
  build.
- The `.claude/settings.json` Stop hook (auto-commit + push) did not fire on
  the same turn it was created in — it only started working from the next
  turn onward. If a hook seems silently inactive right after being
  configured, that's expected; it isn't broken.
- `gh` is authenticated as `jackvanzeeland`; the repo is
  `jackvanzeeland/would-you-rather` (private).

