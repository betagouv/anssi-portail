import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
import { plateformePlugin } from './src/plateforme/plateforme.plugin';

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
    plateformePlugin(),
  ],
});
