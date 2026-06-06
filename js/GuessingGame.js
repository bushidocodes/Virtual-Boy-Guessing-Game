// ______________________________________________________________________________
// |                  |`````| ||  || ||    ||     /```/ |````|  /\    // || //   |
// |      //\\        |  |``` ||  || ||    ||     \ \`   `||`  //\\  //  ||//    |
// |    ///  \\\      |  ```| ||  || ||__  ||__    _\ \   ||  //  \\ \\  ||\\    |
// |  ///      \\\    |__|``` \\__// |___| |___|  \___/   || //    \\ \\ || \\   |
// |  \\\  /\  ///                                                               |
// |    \\//\\//       //\\   //  //\\  ||\\  ||^^   /\  /\  \\  //              |
// |      \\//        ||__|| ||  ||__|| || || ||==  //\\//\\   ||                |
// |                  ||``||  \\ ||``|| ||//  ||,, //  \/  \\  ||                |
// ```````````````````````````````````````````````````````````````````````````````

let game;

function generateWinningNumber() {
    return Math.floor(Math.random() * 100 + 1);
}

// Implements Fisher-Yates Algorithm
// https://www.frankmitchell.org/2015/01/fisher-yates/
function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
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
    return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission = function (guess) {
    if (typeof guess === 'number' && Number.isInteger(guess) && guess >= 1 && guess <= 100) {
        this.playersGuess = guess;
        return this.checkGuess();
    }
    throw 'That is an invalid guess.';
};

Game.prototype.checkGuess = function () {
    if (this.playersGuess === this.winningNumber) {
        this.pastGuesses.push(this.playersGuess);
        return 'You Win!';
    } else if (this.pastGuesses.indexOf(this.playersGuess) > -1) {
        return 'You have already guessed that number.';
    } else {
        this.pastGuesses.push(this.playersGuess);
        if (this.pastGuesses.length >= 5) {
            return `You Lose. Was ${this.winningNumber}`;
        }
        const diff = this.difference();
        if (diff < 10) {
            return "You're burning up!";
        } else if (diff < 25) {
            return "You're lukewarm.";
        } else if (diff < 50) {
            return "You're a bit chilly.";
        } else {
            return "You're ice cold!";
        }
    }
};

Game.prototype.provideHint = function () {
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

const controller = {};
controller.enterPlayerGuess = function () {
    controller.guessInput = parseInt($('#players-input').val(), 10);
    $('#players-input').val("");
    $('#players-input').focus();

    try {
        controller.guessOutput = game.playersGuessSubmission(controller.guessInput);
        $('#title').text(controller.guessOutput);
        if (controller.guessOutput === "You Win!" || controller.guessOutput.startsWith('You Lose.')) {
            $('#subtitle').text('Click Reset to play again');
            $('#submit').prop("disabled", true);
            $('#hint').prop("disabled", true);
            $('#players-input').prop("disabled", true);
        } else {
            $('#subtitle').text(game.isLower() ? "Guess Higher" : "Guess Lower");
        }
        for (let i = 0; i < game.pastGuesses.length; i++) {
            $(`#guess-list li:nth-child(${i + 1})`).text(game.pastGuesses[i]);
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
        $('#title').text('Vector Guess');
        $('#subtitle').text('Guess a number between 1-100!');
        for (let i = 0; i < 5; i++) {
            $(`#guess-list li:nth-child(${i + 1})`).text("-");
        }
        $('#submit').prop("disabled", false);
        $('#hint').prop("disabled", false);
        $('#players-input').prop("disabled", false);
        $('#players-input').focus();
    });

    $('#hint').click(function () {
        $('#title').text(game.provideHint().join("? ") + "?");
        $('#hint').attr("disabled", true);
        $('#players-input').focus();
    });
});