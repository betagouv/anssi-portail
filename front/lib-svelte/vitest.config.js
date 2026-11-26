import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vitest/config';
import { aliasSvelte } from './alias.plugin.js';

export default defineConfig({
  test: {
    root: './test',
    fsModuleCache: true,
    setupFiles: ['vitest-localstorage-mock'],
  },
  plugins: [svelte(), aliasSvelte()],
});
