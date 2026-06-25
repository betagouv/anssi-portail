import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  compilerOptions: { customElement: false },
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
};
