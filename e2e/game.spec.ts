import { test, expect } from '@playwright/test';

test('loads with correct initial state', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#title')).toHaveText('Vector Guess');
    await expect(page.locator('#subtitle')).toHaveText('Guess a number between 1-100!');
    await expect(page.locator('#submit')).toBeEnabled();
    await expect(page.locator('#hint')).toBeEnabled();
    for (let i = 1; i <= 5; i++) {
        await expect(page.locator(`#guess-list li:nth-child(${i})`)).toHaveText('-');
    }
});

test('valid guess shows feedback and fills the first guess slot', async ({ page }) => {
    await page.goto('/');
    await page.fill('#players-input', '50');
    await page.click('#submit');
    const title = await page.locator('#title').textContent();
    const validMessages = [
        'You Win!', "You're burning up!", "You're lukewarm.",
        "You're a bit chilly.", "You're ice cold!",
    ];
    expect(validMessages).toContain(title);
    await expect(page.locator('#guess-list li:nth-child(1)')).toHaveText('50');
    await expect(page.locator('#players-input')).toHaveValue('');
});

test('Enter key submits a guess', async ({ page }) => {
    await page.goto('/');
    await page.fill('#players-input', '50');
    await page.press('#players-input', 'Enter');
    await expect(page.locator('#guess-list li:nth-child(1)')).toHaveText('50');
});

test('duplicate guess shows duplicate message', async ({ page }) => {
    await page.goto('/');
    await page.fill('#players-input', '50');
    await page.click('#submit');
    await page.fill('#players-input', '50');
    await page.click('#submit');
    await expect(page.locator('#title')).toHaveText('You have already guessed that number.');
});

test('hint shows 3 numbers between 1-100 and disables the hint button', async ({ page }) => {
    await page.goto('/');
    await page.click('#hint');
    const hintText = await page.locator('#title').textContent();
    const numbers = hintText!.replace(/\?/g, '').trim().split(' ').map(Number);
    expect(numbers).toHaveLength(3);
    for (const n of numbers) {
        expect(n).toBeGreaterThanOrEqual(1);
        expect(n).toBeLessThanOrEqual(100);
    }
    await expect(page.locator('#hint')).toBeDisabled();
});

test('correct guess wins the game and locks the controls', async ({ page }) => {
    // Fix Math.random so the winning number is always 42
    await page.addInitScript(() => { Math.random = () => 0.41; });
    await page.goto('/');
    await page.fill('#players-input', '42');
    await page.click('#submit');
    await expect(page.locator('#title')).toHaveText('You Win!');
    await expect(page.locator('#subtitle')).toHaveText('Click Reset to play again');
    await expect(page.locator('#submit')).toBeDisabled();
    await expect(page.locator('#hint')).toBeDisabled();
    await expect(page.locator('#players-input')).toBeDisabled();
});

test('5 wrong guesses loses the game and locks the controls', async ({ page }) => {
    // Fix Math.random so the winning number is always 42
    await page.addInitScript(() => { Math.random = () => 0.41; });
    await page.goto('/');
    for (const n of [1, 2, 3, 4, 5]) {
        await page.fill('#players-input', String(n));
        await page.click('#submit');
    }
    await expect(page.locator('#title')).toHaveText('You Lose. Was 42');
    await expect(page.locator('#submit')).toBeDisabled();
    await expect(page.locator('#players-input')).toBeDisabled();
});

test('reset clears the board and re-enables controls', async ({ page }) => {
    await page.goto('/');
    await page.fill('#players-input', '50');
    await page.click('#submit');
    await page.click('#reset');
    await expect(page.locator('#title')).toHaveText('Vector Guess');
    await expect(page.locator('#subtitle')).toHaveText('Guess a number between 1-100!');
    await expect(page.locator('#submit')).toBeEnabled();
    await expect(page.locator('#hint')).toBeEnabled();
    await expect(page.locator('#players-input')).toBeEnabled();
    for (let i = 1; i <= 5; i++) {
        await expect(page.locator(`#guess-list li:nth-child(${i})`)).toHaveText('-');
    }
});
