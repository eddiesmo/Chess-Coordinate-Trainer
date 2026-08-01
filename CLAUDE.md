# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Chess Square Trainer — a single-page React game where a random square is highlighted on a chessboard and the player types its algebraic name (`e4`) as fast as possible before a timer runs out.

Fully static: no backend, no network calls, no persistence. `vite build` output is the entire deployable artifact.

## Deployment

Live at https://chess-square-trainer.eddiesmo.com/ on GitHub Pages. `.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main` — no manual deploy step, and `dist/` stays gitignored.

Two things are load-bearing and easy to break:
- **`public/CNAME`** holds the custom domain. Vite copies `public/` into `dist/`, so it ships with every build. Deleting it, or moving it to the repo root, can drop the domain binding on the next deploy.
- **No `base` in `vite.config.js`.** The custom domain serves from `/`, so the default is correct. Setting a `base` would break asset paths. Conversely, if the site ever moves to a `github.io/<repo>` path URL, `base` becomes mandatory.

`.replit` is a leftover from the previous host and is no longer used.

## Commands

```sh
npm run dev      # Vite dev server on :5173 (host 0.0.0.0)
npm run build    # production build to dist/
npm run preview  # serve the built dist/
npm run format   # prettier --write over src/**
```

Node version is pinned in `.nvmrc` (v22.14.0). `bootstrap.sh` does a clean nvm + `npm install` setup.

There is no test suite, no linter, and no TypeScript (the `typescript` devDependency is vestigial; `tsconfig.json` was deliberately removed). Verification is manual: run `npm run dev` and play the game.

Update `CHANGELOG.md` when making user-visible changes — it is maintained by hand, newest date first.

## Architecture

Single-route app: `index.jsx` → `App.jsx` → `ChessSquareGame.jsx`. Everything below is composed by `ChessSquareGame`, which is the only stateful orchestrator.

**State lives in `hooks/useChessGame.js`, not in components.** It owns the highlighted square, score/high score, guess log, board orientation, custom time, hint toggles, and the per-square animation effects. It returns a flat bag of values and callbacks. Components are presentational and receive everything via props — do not add local game state to components.

**Time is split across three independent mechanisms**, which is the main source of subtle bugs:
- `useCountdown` (`hooks/timers.js`) — the 3-2-1 pre-game overlay; takes an `onComplete` callback that fires `startActualGame`.
- `useGameTimer` (`hooks/timers.js`) — the authoritative countdown. It polls every 100 ms and derives `timeLeft` from `Date.now() - startTime`, deliberately *not* by decrementing, so re-renders from rapid guessing can't skew the clock.
- The progress bar in `ScoreBoard.jsx` — a separate framer-motion `useAnimation` width tween of `Number(customTime)` seconds, started once when `gameActive` flips true. It is not driven by `timeLeft`. If you change game duration handling, both this and `useGameTimer` must be updated or the bar desyncs from the displayed seconds.

**Square appearance is a framer-motion variant state machine.** `useChessGame.getSquareVariant(square)` maps board state to one of the variants in `constants/squareVariants.js` (`base` / `highlighted` / `incorrect` / `firstBlink`). `ChessBoard` just renders `animate={getSquareVariant(square)}` per cell. To change highlight/error/blink visuals, edit `squareVariants.js` — not the component. Note `ChessSquareGame` wraps the callback to force `'base'` for every square while the countdown overlay is up.

**Board orientation** is a render-time reversal only. `boardFlipped` reverses `filesDefault`/`ranksDefault` from `utils/chessUtils.js` in `ChessBoard`, and separately in `ChessSquareGame` for the rank/file hint overlays. The underlying square names never change. Any new board-adjacent overlay must replicate the same reversal logic.

**Input has two entirely separate paths** in `GameControls.jsx`, selected by `useIsMobile()` (768px width breakpoint, resize-aware):
- Desktop: a text `<input>` that auto-submits on `onChange` as soon as the value matches `/^[a-h][1-8]$/`, with Enter as a fallback. It passes the raw value to `handleSubmitGuess` rather than reading state, since state hasn't flushed yet.
- Mobile: `MobileKeypad.jsx`, a file-then-rank two-tap keypad that auto-submits via `setTimeout(..., 0)` for the same reason.

`handleSubmitGuess` therefore accepts an optional string argument and falls back to `userGuess` state when called without one.

**Analytics** go through `hooks/useGoogleAnalytics.js`, a thin no-op-safe wrapper over `window.gtag` (the gtag snippet is inline in `index.html`). All event emission is done in `ChessSquareGame` by wrapping the raw callbacks from `useChessGame` — keep instrumentation at that layer so the game hook stays side-effect-free.

## Gotchas

- `ChessBoard` accepts a `highlightedSquare` prop that `ChessSquareGame` never passes; the local `isHighlighted` flag inside it is consequently always false and dead. Highlighting is done entirely through `getSquareVariant`.
- PostCSS config must stay `postcss.config.cjs`, not `.js`, because `package.json` sets `"type": "module"`. Vite discovers it automatically — don't add an explicit `css.postcss` path to `vite.config.js`.
- High score is in-memory only — it resets on reload. There is no persistence layer.
- Board colors are inverted relative to a real chessboard in places and squares are drawn edge-to-edge with 0.5px borders and no gap/rounding; this is intentional (see the most recent commit).

## Style

Prettier config in `.prettierrc`: single quotes, semicolons, 2-space indent, 100 col. Run `npm run format` before committing. Tailwind utility classes inline in JSX; the only non-Tailwind CSS is the three `@tailwind` directives in `src/App.css`.
