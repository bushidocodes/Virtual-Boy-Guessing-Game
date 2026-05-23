# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based number guessing game styled after the Nintendo Virtual Boy (black background, red text, Orbitron font).

## Commands

```sh
npm install   # install dev dependencies (jasmine, serve)
npm start     # serve the game at http://localhost:3000
npm test      # run Jasmine specs headlessly in Node
```

## Testing

`npm test` runs `js/GuessingGame_spec.js` via Jasmine in Node. The setup helper (`spec/helpers/setup.js`) stubs `window` and jQuery so the game logic loads without a browser.

`test.html` is a browser-based alternative runner (open via `npm start` then navigate to `/test.html`). It loads Jasmine 2.4.1 from CDN.

The spec file is excluded from the production `index.html` via an HTML comment.

## Architecture

`js/GuessingGame.js` is the only application file. It is structured in two layers with no modules — everything is global:

**Game logic layer** (pure, testable):
- `generateWinningNumber()` — returns random integer 1–100
- `shuffle(arr)` — Fisher-Yates in-place shuffle
- `Game` constructor + prototype methods: `difference()`, `isLower()`, `playersGuessSubmission()`, `checkGuess()`, `provideHint()`

**Controller layer** (DOM/jQuery, not unit tested):
- `controller` object with `enterPlayerGuess()` method — reads `#players-input`, calls `game.playersGuessSubmission()`, updates `#title`, `#subtitle`, and the `#guess-list` `<li>` elements
- `$(document).ready(...)` wires up `#submit`, `#reset`, and `#hint` button click handlers

The `game` variable is a global `Game` instance. Resetting replaces it with `new Game()` and resets the DOM.

## CSS Layout

`css/style.css` uses nested flexbox: `body` is a column flex container (header / main / footer), and `main` is a column flex container (input section / guess list / menu buttons). Responsive breakpoints scale the circular input and guess list tiles at 768px (tablet) and 1025px (desktop).
