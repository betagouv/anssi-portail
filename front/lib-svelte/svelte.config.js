import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

export default {
  compilerOptions: { customElement: true },
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),
  onwarn(warning, defaultHandler) {
    defaultHandler(warning);

    if (process.env.CI) {
      throw new Error(`[svelte:${warning.code}] ${warning.message}`);
    }
  },
};
