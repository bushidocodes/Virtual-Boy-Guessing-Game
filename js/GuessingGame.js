var game, controller;

function generateWinningNumber() {
    return Math.floor(Math.random() * 100 + 1);
}

// Implements Fisher-Yates Algorithm
// https://www.frankmitchell.org/2015/01/fisher-yates/
function shuffle(arr) {
    var i = 0, j = 0, temp = 0;
    for (i = arr.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function () {
    return Math.abs(this.playersGuess - this.winningNumber);
};

Game.prototype.isLower = function () {
    if (this.playersGuess < this.winningNumber) {
        return true;
    } else {
        return false;
    }
};

Game.prototype.playersGuessSubmission = function (guess) {
    if (typeof guess === 'number' && guess >= 1 && guess <= 100) {
        this.playersGuess = guess;
        return this.checkGuess();
    } else {
        throw 'That is an invalid guess.';
    }
};

Game.prototype.checkGuess = function () {
    if (this.playersGuess === this.winningNumber) {
        this.pastGuesses.push(this.playersGuess);
        return 'You Win!';
    } else if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
        console.log("Aready guess: " + this.pastGuesses.indexOf(this.playersGuess));
        return 'You already guessed ' + this.playersGuess;
    } else {
        this.pastGuesses.push(this.playersGuess);
        if (this.pastGuesses.length >= 5) {
            return 'You Lose. Was ' + this.winningNumber;
        }
        if (Math.abs(this.playersGuess - this.winningNumber) < 10) {
            return "You're burning up!";
        }
        if (Math.abs(this.playersGuess - this.winningNumber) < 25) {
            return "You're lukewarm.";
        }
        if (Math.abs(this.playersGuess - this.winningNumber) < 50) {
            return "You're a bit chilly.";
        }
        if (Math.abs(this.playersGuess - this.winningNumber) < 100) {
            return "You're ice cold!";
        }
    }
};

Game.prototype.provideHint = function () {
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

controller = {};
controller.enterPlayerGuess = function () {
    // Save player's guess and clear UI
    controller.guessInput = parseInt($('#players-input').val(), 10);
    $('#players-input').val("");
    $('#players-input').focus();


    try {
        // Submit the player's guess, save the result
        controller.guessOutput = game.playersGuessSubmission(controller.guessInput);
        // Render the results to screen
        $('#title').text(controller.guessOutput);
        // alert(controller.guessOutput.slice(0,8));
        if (controller.guessOutput === "You Win!" || controller.guessOutput.slice(0,9) === 'You Lose.') {
            $('#subtitle').text('Click Reset to play again');
            $('#submit').attr("disabled", true);
            $('#hint').attr("disabled", true);
            $('#players-input').attr("disabled", true);
            // $('#reset').focus();
            // $('#players-input').off('keypress');
        } else {
            $('#subtitle').text(game.isLower() ? "Guess Higher" : "Guess Lower");
        }
        for (var i = 0; i < game.pastGuesses.length; i++) {
            $('#guess-list li:nth-child(' + (i + 1) + ')').text(game.pastGuesses[i]);
        }
        delete controller.guessInput;
    } catch (err) {
        $('#title').text(err);
        if (game.pastGuesses.length > 0) {
            $('#subtitle').text(game.isLower() ? "Guess Higher than " + game.pastGuesses[game.pastGuesses.length - 1] : "Guess Lower than " + game.pastGuesses[game.pastGuesses.length - 1]);
        }
    } finally {

        delete controller.guessOutput;
    }



};

$(document).ready(function () {
    game = new Game();
    $('#submit').click(controller.enterPlayerGuess);
    $('#players-input').keypress(function (event) {
        if (event.which === 13) {
            controller.enterPlayerGuess();
        }
    });

    $('#reset').click(function () {
        game = new Game();
        $('#title').text('Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!');
        for (var i = 0; i < 5; i++) {
            $('#guess-list li:nth-child(' + (i + 1) + ')').text("-");
        }
        $('#submit').attr("disabled", false);
        $('#hint').attr("disabled", false);
        $('#players-input').attr("disabled", false);
        $('#players-input').focus();
        // $('#players-input').keypress(function (event) {
        //     if (event.which === 13) {
        //         controller.enterPlayerGuess();
        //     }
        // });
    });

    $('#hint').click(function () {
        $('#title').text(game.provideHint().join("? ") + "?");
        $('#hint').attr("disabled", true);
        $('#players-input').focus();
    });
});