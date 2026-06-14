import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        restoreMocks: true,
        exclude: ['e2e/**', 'node_modules/**'],
    },
});
