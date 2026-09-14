import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    conditions: ['anssi-portail:source'],
  },
  test: {
    include: ['tests/**/*.spec.ts'],
    environment: 'node',
    allowOnly: false,
    restoreMocks: true,
  },
});
