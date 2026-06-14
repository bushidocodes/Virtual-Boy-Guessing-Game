import { Game } from './GuessingGame.js';

let game;

const controller = {
    enterPlayerGuess() {
        const input = document.getElementById('players-input');
        const guess = parseInt(input.value, 10);
        input.value = '';
        input.focus();

        try {
            const result = game.playersGuessSubmission(guess);
            document.getElementById('title').textContent = result;
            if (result === 'You Win!' || result.startsWith('You Lose.')) {
                document.getElementById('subtitle').textContent = 'Click Reset to play again';
                document.querySelectorAll('#submit, #hint, #players-input')
                    .forEach(el => { el.disabled = true; });
            } else {
                document.getElementById('subtitle').textContent =
                    game.isLower() ? 'Guess Higher' : 'Guess Lower';
            }
            game.pastGuesses.forEach((pastGuess, i) => {
                document.querySelector(`#guess-list li:nth-child(${i + 1})`).textContent = pastGuess;
            });
        } catch (err) {
            document.getElementById('title').textContent = err.message;
            if (game.pastGuesses.length > 0) {
                const lastGuess = game.pastGuesses.at(-1);
                const direction = game.isLower() ? 'Higher' : 'Lower';
                document.getElementById('subtitle').textContent = `Guess ${direction} than ${lastGuess}`;
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    game = new Game();

    document.getElementById('submit').addEventListener('click', controller.enterPlayerGuess);

    document.getElementById('players-input').addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            controller.enterPlayerGuess();
        }
    });

    document.getElementById('reset').addEventListener('click', () => {
        game = new Game();
        document.getElementById('title').textContent = 'Vector Guess';
        document.getElementById('subtitle').textContent = 'Guess a number between 1-100!';
        document.querySelectorAll('#guess-list .guess').forEach(el => { el.textContent = '-'; });
        document.querySelectorAll('#submit, #hint, #players-input')
            .forEach(el => { el.disabled = false; });
        document.getElementById('players-input').focus();
    });

    document.getElementById('hint').addEventListener('click', () => {
        document.getElementById('title').textContent = `${game.provideHint().join('? ')}?`;
        document.getElementById('hint').disabled = true;
        document.getElementById('players-input').focus();
    });
});
