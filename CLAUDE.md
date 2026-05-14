# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Goal

Build a single-page interactive dashboard identifying the top 5 most impactful engineers at PostHog, using data from the [PostHog GitHub repository](https://github.com/PostHog/posthog) over at least the last 90 days. The audience is a busy engineering leader — findings must be self-explanatory with clear methodology.

---

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm start        # Serve production build
npm run lint     # Run ESLint
```

No test runner is configured yet.

---

## Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4

**Entry points:**
- `app/layout.tsx` — root layout with Geist font, sets `min-h-full flex flex-col` on body
- `app/page.tsx` — the dashboard page (currently a scaffold placeholder)
- `app/globals.css` — global styles, Tailwind base

**Data layer (to be built):** GitHub data should be fetched server-side. Next.js API routes go under `app/api/`. For heavy data fetching, use Next.js Route Handlers (`app/api/*/route.ts`) so the GitHub token stays server-side and the client only receives processed results.

**Styling:** Tailwind CSS 4 via `@tailwindcss/postcss` — config is in `postcss.config.mjs`, not a `tailwind.config.*` file (v4 convention).

---

## Files to maintain

### 1. `docs/decisions.md`

Every time we make a meaningful technical choice (architecture, state management, data flow), add an entry formatted exactly like this:

- **The Problem:** What were we trying to solve?
- **The Options We Had:** List 2-3 realistic alternatives we looked at.
- **Our Choice:** What we picked.
- **Why We Chose It:** The plain-English reason, focusing on why it fits this specific problem best.

### 2. `docs/tradeoffs.md`

For every choice in `decisions.md`, document the "cost" of that choice here.

- **Format:** `[Our Choice] over [Alternative]`
- **Explanation:** `We gained [Benefit] but we sacrificed [Drawback/Risk].`

### 3. `docs/walkthrough.md`

A plain-English tour of how the code actually runs. Explain the **flow of data**, not just function names.

### 4. `docs/weak_spots.md`

Flag any clever pattern, complex regex, or library internal that might be hard to explain under pressure.

- **Format:** `Code Location / Concept` → `Why it's tricky` → `How to explain it simply`
- Include intentional technical debt.

---

## Rules when helping me code

1. **Propose before writing.** When we make a non-trivial design decision, propose an addition to `decisions.md` and `tradeoffs.md` **before** writing it. Show me the diff.
2. **Flag tricky concepts.** When you use a concept I might not understand (a library internal, a clever pattern, a non-obvious language feature), flag it and propose an entry in `weak_spots.md`.
3. **Update the walkthrough.** After writing code, propose an update to `walkthrough.md` that explains what changed in plain English.
4. **Use my reasoning, not yours.** Use MY reasoning from the conversation, not your inferred reasoning. If you're not sure why I made a choice, **ASK before writing it down**.
5. **No unexplained code.** Never write code I haven't seen explained. If I don't ask "why?", you ask "do you want me to explain why?"

---

## Tone

I'm preparing for an interview where bluffing kills me.

- Be honest about what's uncertain in your suggestions.
- Don't write confident-sounding docs about reasoning that isn't real.
- If a decision was made for a weak reason (e.g., "we were running out of time"), say so plainly in the docs rather than inventing a principled justification.
