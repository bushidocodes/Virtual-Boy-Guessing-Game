# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based number guessing game styled after the Nintendo Virtual Boy (black background, red text, Orbitron font).

## Commands

```sh
npm install        # install dev dependencies (vite, typescript, vitest, playwright)
npm start          # serve the game via Vite at http://localhost:3000
npm run build      # build the production bundle to dist/
npm run typecheck  # type-check the sources with tsc --noEmit
npm test           # run Vitest unit specs headlessly in Node
npm run test:e2e   # run Playwright end-to-end specs (needs `npm run test:e2e:install` once)
```

## Testing

`npm test` runs `spec/GuessingGame.spec.ts` via Vitest in Node. Vitest transpiles TypeScript on the fly, so no build step is needed; globals (`describe`, `it`, `expect`) are enabled in `vitest.config.ts`.

`npm run test:e2e` runs `e2e/game.spec.ts` via Playwright (Chromium). `playwright.config.ts` boots the Vite dev server (`npm start`) automatically before the run.

## Architecture

The app is written in TypeScript (ESM, no framework) and bundled by Vite. `index.html` loads `js/controller.ts` as a module entry; Vite resolves the `./GuessingGame.js` import specifier to `GuessingGame.ts`.

**Game logic layer** — `js/GuessingGame.ts` (pure, unit-tested):
- `generateWinningNumber()` — returns random integer 1–100
- `shuffle(arr)` — Fisher-Yates in-place shuffle
- `Game` class with methods: `difference()`, `isLower()`, `playersGuessSubmission()`, `checkGuess()`, `provideHint()`. State (`playersGuess`, `pastGuesses`, `winningNumber`) is held as typed instance fields. `playersGuessSubmission` takes `unknown` and narrows at runtime, so invalid-input tests type-check.

**Controller layer** — `js/controller.ts` (DOM, not unit tested):
- `controller` object with `enterPlayerGuess()` method — reads `#players-input`, calls `game.playersGuessSubmission()`, updates `#title`, `#subtitle`, and the `#guess-list` `<li>` elements
- a `DOMContentLoaded` handler wires up `#submit`, `#reset`, and `#hint` click handlers (plus Enter-to-submit on the input)

The `game` variable is a module-scoped `Game` instance. Resetting replaces it with `new Game()` and resets the DOM.

## CSS Layout

`css/style.css` uses nested flexbox: `body` is a column flex container (header / main / footer), and `main` is a column flex container (input section / guess list / menu buttons). Responsive breakpoints scale the circular input and guess list tiles at 768px (tablet) and 1025px (desktop).
