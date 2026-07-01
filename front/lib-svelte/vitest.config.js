import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    root: './test',
    setupFiles: ['vitest-localstorage-mock'],
  },
  plugins: [
    svelte({
      compilerOptions: {
        runes: true,
      },
    }),
  ],
});
