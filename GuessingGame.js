function generateWinningNumber() {
    return Math.floor(Math.random() * 100 + 1);
}

// Implements Fisher-Yates Algorithm
// https://www.frankmitchell.org/2015/01/fisher-yates/
function shuffle(arr){
    var i = 0, j = 0, temp = 0;
    for (i = arr.length - 1; i > 0; i -= 1) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function Game(){
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
        return 'You Win!';
    } else if (this.pastGuesses.indexOf(this.playersGuess) !== -1) {
        return 'You have already guessed that number.';
    } else {
        this.pastGuesses.push(this.playersGuess);
        if (this.pastGuesses.length >= 5) {
            return 'You Lose.';
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

Game.prototype.provideHint = function(){
    return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
};

function newGame () {
    return new Game;
}
