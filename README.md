# Would You Rather

A party game of impossible choices. Pick a side across 7 categories —
Deep Thoughts, Family, Friends, Dating, Occupation, Dreams, and Recreation —
drawing from **943 curated dilemmas**.

Built with Next.js (App Router), TypeScript, and Tailwind CSS, deployed on Vercel.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How it's put together

- **`data/questions.json`** — the full question set: a flat array of
  `{ option1, option2, category }` objects. This is the single source of
  truth the app reads from (`src/lib/data.ts`).
- **`data/categories.json`** — the 7 canonical category labels.
- **`data/raw/<category>/`** — the raw source pages each category's questions
  were gathered and deduplicated from, kept locally for provenance (not
  committed to git — see `.gitignore`).
- **`src/components/`** — `GameApp` (state machine: setup → play), `CategoryPicker`
  (category selection screen), `DuelStage` + `OptionPanel` + `OrBadge` (the
  head-to-head question screen).
- **`src/lib/theme.ts`** — the per-category accent color palette.

## Playing

- Pick which categories you want in the deck, then start.
- Click/tap a side to choose it, or use the keyboard: `←`/`→` (or `1`/`2`) to
  pick, `S` to skip, `Enter`/`Space` to advance once you've picked.
- The gear icon returns to category selection at any time.

## Deploying

```bash
npx vercel
```

or connect the GitHub repo at [vercel.com/new](https://vercel.com/new).
