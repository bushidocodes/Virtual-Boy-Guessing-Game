const fs = require('fs');
const path = require('path');

// Expose browser globals that GuessingGame.js and the specs depend on
global.window = global;
global.document = {};

// Minimal jQuery stub — only enough to prevent the $(fn) ready call
// from crashing; the controller layer is not under test
const noop = () => stub;
const stub = {
  click: noop, on: noop, val: () => '', text: noop,
  prop: noop, focus: noop, ready: noop,
};
global.$ = () => stub;

// Load source into global scope. Function declarations (generateWinningNumber, shuffle)
// are promoted to the global object automatically. class Game is not, so append an
// explicit globalThis assignment so spies can target it via window.Game.
const src = fs.readFileSync(path.resolve(__dirname, '../../js/GuessingGame.js'), 'utf8');
(0, eval)(src + '\nglobalThis.Game = Game;');
