import { describe, it, expect, beforeEach, vi } from 'vitest';
import { generateWinningNumber, shuffle, Game } from '../js/GuessingGame.js';

describe('generateWinningNumber', () => {
    it('returns a random number between 1 and 100', () => {
        const spy = vi.spyOn(Math, 'random').mockReturnValue(0.155);
        expect(generateWinningNumber()).toBe(16);
        spy.mockReturnValue(0.0000034);
        expect(generateWinningNumber()).toBe(1);
        spy.mockReturnValue(0.9999934);
        expect(generateWinningNumber()).toBe(100);
    });
});

describe('shuffle', () => {
    it('takes an array as an argument, and returns an array', () => {
        expect(shuffle([20, 50, 70])).toHaveLength(3);
    });

    it('shuffles an array using Math.random to place elements', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        const shuffledArray = shuffle([20, 50, 70]);
        expect(Math.random).toHaveBeenCalled();
        expect(shuffledArray).toEqual([20, 70, 50]);
    });

    it('returns the array shuffled in place', () => {
        const unshuffledArray = [20, 50, 70];
        const shuffledArray = shuffle(unshuffledArray);
        expect(shuffledArray).toBe(unshuffledArray);
    });
});

describe('Game', () => {
    let game;

    beforeEach(() => {
        game = new Game();
    });

    it('initializes playersGuess to null and pastGuesses to []', () => {
        expect(game.playersGuess).toBeNull();
        expect(game.pastGuesses).toEqual([]);
    });

    it('sets winningNumber by calling generateWinningNumber', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.5);
        game = new Game();
        expect(Math.random).toHaveBeenCalled();
        expect(game.winningNumber).toBe(51);
    });

    describe('difference', () => {
        it('returns the absolute value of the difference between playersGuess and winningNumber', () => {
            game.playersGuess = 20;
            game.winningNumber = 10;
            expect(game.difference()).toBe(10);
            game.winningNumber = 30;
            expect(game.difference()).toBe(10);
        });
    });

    describe('isLower', () => {
        it('returns true if playersGuess is lower than winningNumber, and false if not', () => {
            game.playersGuess = 20;
            game.winningNumber = 10;
            expect(game.isLower()).toBe(false);
            game.winningNumber = 30;
            expect(game.isLower()).toBe(true);
        });
    });

    describe('playersGuessSubmission', () => {
        it('takes a number as an argument and sets that as playersGuess', () => {
            game.playersGuessSubmission(42);
            expect(game.playersGuess).toBe(42);
        });

        it('throws an error if the number is invalid (less than 1, greater than 100, or not a number)', () => {
            expect(() => game.playersGuessSubmission(0)).toThrowError('That is an invalid guess.');
            expect(() => game.playersGuessSubmission(-1)).toThrowError('That is an invalid guess.');
            expect(() => game.playersGuessSubmission(101)).toThrowError('That is an invalid guess.');
            expect(() => game.playersGuessSubmission('not a number')).toThrowError('That is an invalid guess.');
            expect(() => game.playersGuessSubmission(42.5)).toThrowError('That is an invalid guess.');
        });

        it('calls checkGuess', () => {
            vi.spyOn(Game.prototype, 'checkGuess');
            game.playersGuessSubmission(42);
            expect(Game.prototype.checkGuess).toHaveBeenCalled();
        });
    });

    describe('checkGuess', () => {
        it('returns a string', () => {
            expect(typeof game.playersGuessSubmission(42)).toBe('string');
        });

        it('returns "You Win!" if playersGuess equals winningNumber', () => {
            game.winningNumber = 42;
            expect(game.playersGuessSubmission(42)).toBe('You Win!');
        });

        it('returns "You have already guessed that number." if playersGuess is in pastGuesses', () => {
            game.winningNumber = 42;
            game.playersGuessSubmission(36);
            expect(game.playersGuessSubmission(36)).toBe('You have already guessed that number.');
        });

        it("if playersGuess isn't the winningNumber or a duplicate, add it to pastGuesses", () => {
            game.winningNumber = 42;
            game.playersGuessSubmission(36);
            expect(game.pastGuesses).toContain(36);
        });

        it('returns "You Lose" if this is the players 5th guess', () => {
            game.winningNumber = 42;
            game.playersGuessSubmission(1);
            game.playersGuessSubmission(2);
            game.playersGuessSubmission(3);
            game.playersGuessSubmission(4);
            expect(game.playersGuessSubmission(5)).toContain('You Lose');
        });

        it("returns \"You're burning up!\" if the difference is less than 10", () => {
            game.winningNumber = 42;
            expect(game.playersGuessSubmission(45)).toBe("You're burning up!");
        });

        it("returns \"You're lukewarm.\" if the difference is less than 25", () => {
            game.winningNumber = 42;
            expect(game.playersGuessSubmission(62)).toBe("You're lukewarm.");
        });

        it("returns \"You're a bit chilly.\" if the difference is less than 50", () => {
            game.winningNumber = 42;
            expect(game.playersGuessSubmission(72)).toBe("You're a bit chilly.");
        });

        it("returns \"You're ice cold!\" if the difference is less than 100", () => {
            game.winningNumber = 42;
            expect(game.playersGuessSubmission(92)).toBe("You're ice cold!");
        });
    });

    describe('provideHint', () => {
        it('generates an array with a length of 3', () => {
            expect(game.provideHint()).toHaveLength(3);
        });

        it('includes the winningNumber', () => {
            expect(game.provideHint()).toContain(game.winningNumber);
        });

        it('calls generateWinningNumber to fill the rest of the hint array with random numbers', () => {
            game.winningNumber = 42;
            vi.spyOn(Math, 'random').mockReturnValue(0.5);
            const hint = game.provideHint();
            // Math.random=0.5 → generateWinningNumber returns 51; both decoys should be 51
            expect(hint.filter(n => n === 51)).toHaveLength(2);
        });

        it('calls the shuffle function', () => {
            game.winningNumber = 100;
            vi.spyOn(Math, 'random').mockReturnValue(0);
            // Math.random=0 → generateWinningNumber returns 1; shuffle moves 100 to end
            expect(game.provideHint()).toEqual([1, 1, 100]);
        });
    });
});
