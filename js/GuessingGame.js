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

export function generateWinningNumber() {
    return Math.floor(Math.random() * 100 + 1);
}

// Implements Fisher-Yates Algorithm
// https://www.frankmitchell.org/2015/01/fisher-yates/
export function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

export class Game {
    constructor() {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
    }

    difference() {
        return Math.abs(this.playersGuess - this.winningNumber);
    }

    isLower() {
        return this.playersGuess < this.winningNumber;
    }

    playersGuessSubmission(guess) {
        if (typeof guess === 'number' && Number.isInteger(guess) && guess >= 1 && guess <= 100) {
            this.playersGuess = guess;
            return this.checkGuess();
        }
        throw new Error('That is an invalid guess.');
    }

    checkGuess() {
        if (this.playersGuess === this.winningNumber) {
            this.pastGuesses.push(this.playersGuess);
            return 'You Win!';
        }
        if (this.pastGuesses.includes(this.playersGuess)) {
            return 'You have already guessed that number.';
        }
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

    provideHint() {
        return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
    }
}
