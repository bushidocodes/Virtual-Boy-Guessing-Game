describe("generateWinningNumber function", function() {
    it('returns a random number between 1 and 100', function() {
        spyOn(Math, 'random').and.returnValue(0.155);
        expect(generateWinningNumber()).toBe(16);
        Math.random.and.returnValue(0.0000034);
        expect(generateWinningNumber()).toBe(1);
        Math.random.and.returnValue(0.9999934);
        expect(generateWinningNumber()).toBe(100);
    });
});

describe("shuffle function", function() {
    it('takes an array as an argument, and returns an array', function() {
        const shuffledArray = shuffle([20, 50, 70]);
        expect(shuffledArray).toHaveSize(3);
    });
    it('shuffles an array using Math.random to place elements', function() {
        spyOn(Math, 'random').and.returnValue(0.5);
        const shuffledArray = shuffle([20, 50, 70]);
        expect(Math.random).toHaveBeenCalled();
        expect(shuffledArray).toEqual([20, 70, 50]);
    });
    it('returns the array shuffled in place', function() {
        const unshuffledArray = [20, 50, 70];
        const shuffledArray = shuffle(unshuffledArray);
        expect(shuffledArray).toBe(unshuffledArray);
    });
});

describe("Game class", function() {
    let game;

    beforeEach(function() {
        game = new Game();
    });

    it('initializes playersGuess to null and pastGuesses to []', function() {
        expect(game.playersGuess).toBeNull();
        expect(game.pastGuesses).toEqual([]);
    });

    it('sets winningNumber by calling generateWinningNumber', function() {
        spyOn(Math, 'random').and.returnValue(0.5);
        game = new Game();
        expect(Math.random).toHaveBeenCalled();
        expect(game.winningNumber).toBe(51);
    });

    describe("Game methods", function() {

        describe('difference method', function() {
            it('returns the absolute value of the difference between the playersGuess and winningNumber', function() {
                game.playersGuess = 20;
                game.winningNumber = 10;
                expect(game.difference()).toBe(10);
                game.winningNumber = 30;
                expect(game.difference()).toBe(10);
            });
        });

        describe('isLower method', function() {
            it('returns true if the playersGuess is lower than winningNumber, and false if not', function() {
                game.playersGuess = 20;
                game.winningNumber = 10;
                expect(game.isLower()).toBeFalse();
                game.winningNumber = 30;
                expect(game.isLower()).toBeTrue();
            });
        });

        describe("playersGuessSubmission method", function() {
            it('takes a number as an argument and sets that as playersGuess', function() {
                game.playersGuessSubmission(42);
                expect(game.playersGuess).toBe(42);
            });
            it('throws an error if the number is invalid (less than 1, greater than 100, or not a number)', function() {
                expect(function() {
                    game.playersGuessSubmission(0);
                }).toThrowError('That is an invalid guess.');
                expect(function() {
                    game.playersGuessSubmission(-1);
                }).toThrowError('That is an invalid guess.');
                expect(function() {
                    game.playersGuessSubmission(101);
                }).toThrowError('That is an invalid guess.');
                expect(function() {
                    game.playersGuessSubmission("not a number");
                }).toThrowError('That is an invalid guess.');
                expect(function() {
                    game.playersGuessSubmission(42.5);
                }).toThrowError('That is an invalid guess.');
            });
            it('calls checkGuess', function() {
                spyOn(Game.prototype, 'checkGuess');
                game.playersGuessSubmission(42);
                expect(Game.prototype.checkGuess).toHaveBeenCalled();
            });
        });

        describe("checkGuess method", function() {
            it('returns a string', function() {
                const result = game.playersGuessSubmission(42);
                expect(typeof result).toBe('string');
            });
            it('returns "You Win!" if playersGuess equals winningGuess', function() {
                game.winningNumber = 42;
                expect(game.playersGuessSubmission(42)).toBe('You Win!');
            });
            it('returns "You have already guessed that number." if playersGuess is in pastGuesses', function() {
                game.winningNumber = 42;
                game.playersGuessSubmission(36);
                expect(game.playersGuessSubmission(36)).toBe('You have already guessed that number.');
            });
            it("if playersGuess isn't the winningNumber or a duplicate, add it to pastGuesses", function() {
                game.winningNumber = 42;
                game.playersGuessSubmission(36);
                expect(game.pastGuesses).toContain(36);
            });
            it('returns "You Lose" if this is the players 5th guess', function() {
                game.winningNumber = 42;
                game.playersGuessSubmission(1);
                game.playersGuessSubmission(2);
                game.playersGuessSubmission(3);
                game.playersGuessSubmission(4);
                expect(game.playersGuessSubmission(5)).toContain('You Lose');
            });
            it(`returns "You're burning up!" if the difference between playersGuess and winningGuess is less than 10`, function() {
                game.winningNumber = 42;
                expect(game.playersGuessSubmission(45)).toBe("You're burning up!");
            });
            it(`returns "You're lukewarm." if the difference between playersGuess and winningGuess is less than 25`, function() {
                game.winningNumber = 42;
                expect(game.playersGuessSubmission(62)).toBe("You're lukewarm.");
            });
            it(`returns "You're a bit chilly." if the difference between playersGuess and winningGuess is less than 50`, function() {
                game.winningNumber = 42;
                expect(game.playersGuessSubmission(72)).toBe("You're a bit chilly.");
            });
            it(`returns "You're ice cold!" if the difference between playersGuess and winningGuess is less than 100`, function() {
                game.winningNumber = 42;
                expect(game.playersGuessSubmission(92)).toBe("You're ice cold!");
            });
        });

        describe("provideHint method", function() {
            it('generates an array with a length of 3', function() {
                const hintArray = game.provideHint();
                expect(hintArray).toHaveSize(3);
            });
            it('includes the winningNumber', function() {
                const hintArray = game.provideHint();
                expect(hintArray).toContain(game.winningNumber);
            });
            it('calls generateWinningNumber to fill the rest of the hint array with random numbers', function() {
                game.winningNumber = 42;
                spyOn(Math, 'random').and.returnValue(0.5);
                const hint = game.provideHint();
                // Math.random=0.5 → generateWinningNumber returns 51; both decoys should be 51
                expect(hint.filter(n => n === 51).length).toBe(2);
            });
            it('calls the shuffle function', function() {
                game.winningNumber = 100;
                spyOn(Math, 'random').and.returnValue(0);
                const hint = game.provideHint();
                // Math.random=0 → generateWinningNumber returns 1; shuffle moves 100 to end
                expect(hint).toEqual([1, 1, 100]);
            });
        });

    });

});
