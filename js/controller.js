import { Game } from './GuessingGame.js';

let game;

const controller = {
    enterPlayerGuess() {
        const guess = parseInt($('#players-input').val(), 10);
        $('#players-input').val("");
        $('#players-input').focus();

        try {
            const result = game.playersGuessSubmission(guess);
            $('#title').text(result);
            if (result === "You Win!" || result.startsWith('You Lose.')) {
                $('#subtitle').text('Click Reset to play again');
                $('#submit, #hint, #players-input').prop("disabled", true);
            } else {
                $('#subtitle').text(game.isLower() ? "Guess Higher" : "Guess Lower");
            }
            game.pastGuesses.forEach((pastGuess, i) => {
                $(`#guess-list li:nth-child(${i + 1})`).text(pastGuess);
            });
        } catch (err) {
            $('#title').text(err.message);
            if (game.pastGuesses.length > 0) {
                const lastGuess = game.pastGuesses.at(-1);
                const direction = game.isLower() ? "Higher" : "Lower";
                $('#subtitle').text(`Guess ${direction} than ${lastGuess}`);
            }
        }
    }
};

$(function () {
    game = new Game();
    $('#submit').click(controller.enterPlayerGuess);
    $('#players-input').on('keydown', function (event) {
        if (event.key === 'Enter') {
            controller.enterPlayerGuess();
        }
    });

    $('#reset').click(function () {
        game = new Game();
        $('#title').text('Vector Guess');
        $('#subtitle').text('Guess a number between 1-100!');
        $('#guess-list .guess').text('-');
        $('#submit, #hint, #players-input').prop("disabled", false);
        $('#players-input').focus();
    });

    $('#hint').click(function () {
        $('#title').text(`${game.provideHint().join("? ")}?`);
        $('#hint').prop("disabled", true);
        $('#players-input').focus();
    });
});
