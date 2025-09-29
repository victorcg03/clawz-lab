import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['src/tests/setup.ts'],
    globals: true,
    exclude: ['node_modules', 'src/tests/e2e/**'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['src/types/**', 'src/tests/e2e/**'],
    },
  },
});
