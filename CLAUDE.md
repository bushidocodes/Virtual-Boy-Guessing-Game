# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A browser-based number guessing game styled after the Nintendo Virtual Boy (black background, red text, Orbitron font). No build system — open `index.html` directly in a browser to run the game.

## Testing

Tests use [Testem](https://github.com/testem/testem) with Jasmine 2. Testem must be installed globally:

```sh
npm install -g testem
testem        # runs tests in watch mode
testem ci     # single run (CI mode)
```

`testem.json` loads all `js/**/*.js` files into the test runner. The spec file (`js/GuessingGame_spec.js`) is excluded from the production HTML via an HTML comment.

### Known spec/implementation mismatches

Two specs in `GuessingGame_spec.js` assert strings that differ from what `GuessingGame.js` actually returns:
- Duplicate guess: spec expects `'You have already guessed that number.'`, implementation returns `'You already guessed ' + this.playersGuess`
- Losing: spec expects `'You Lose.'`, implementation returns `'You Lose. Was ' + this.winningNumber`

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
