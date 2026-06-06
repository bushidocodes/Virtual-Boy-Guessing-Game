const fs = require('fs');
const path = require('path');

// Expose browser globals that GuessingGame.js and the specs depend on
global.window = global;
global.document = {};

// Minimal jQuery stub — only enough to prevent the $(document).ready() call
// from crashing; the controller layer is not under test
const noop = () => stub;
const stub = {
  click: noop, keypress: noop, val: () => '', text: noop,
  attr: noop, focus: noop, ready: noop,
};
global.$ = () => stub;

// Load source into global scope (indirect eval promotes function declarations to global)
const src = fs.readFileSync(path.resolve(__dirname, '../../js/GuessingGame.js'), 'utf8');
(0, eval)(src);
