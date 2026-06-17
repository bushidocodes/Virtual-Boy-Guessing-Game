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

export function generateWinningNumber(): number {
    return Math.floor(Math.random() * 100 + 1);
}

// Implements Fisher-Yates Algorithm
// https://www.frankmitchell.org/2015/01/fisher-yates/
export function shuffle(arr: number[]): number[] {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

export class Game {
    playersGuess: number | null;
    pastGuesses: number[];
    winningNumber: number;

    constructor() {
        this.playersGuess = null;
        this.pastGuesses = [];
        this.winningNumber = generateWinningNumber();
    }

    difference(): number {
        return Math.abs(this.playersGuess! - this.winningNumber);
    }

    isLower(): boolean {
        return this.playersGuess! < this.winningNumber;
    }

    playersGuessSubmission(guess: unknown): string {
        if (typeof guess === 'number' && Number.isInteger(guess) && guess >= 1 && guess <= 100) {
            this.playersGuess = guess;
            return this.checkGuess();
        }
        throw new Error('That is an invalid guess.');
    }

    checkGuess(): string {
        const guess = this.playersGuess!;
        if (guess === this.winningNumber) {
            this.pastGuesses.push(guess);
            return 'You Win!';
        }
        if (this.pastGuesses.includes(guess)) {
            return 'You have already guessed that number.';
        }
        this.pastGuesses.push(guess);
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

    provideHint(): number[] {
        return shuffle([this.winningNumber, generateWinningNumber(), generateWinningNumber()]);
    }
}
