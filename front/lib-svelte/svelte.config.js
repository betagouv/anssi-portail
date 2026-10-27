import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const hotReloadActivé = process.env.SVELTE_DEV_LOCAL_AVEC_HOT_RELOAD === 'true';

export default {
  compilerOptions: { customElement: !hotReloadActivé, runes: true },
  // Consult https://svelte.dev/docs#compile-time-svelte-preprocess
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  vitePlugin: {
    dynamicCompileOptions({ filename }) {
      if (hotReloadActivé && filename.endsWith('/Lien.svelte')) {
        return { customElement: true };
      }
    },
  },

  onwarn(warning, defaultHandler) {
    defaultHandler(warning);

    if (process.env.CI) {
      throw new Error(`[svelte:${warning.code}] ${warning.message}`);
    }
  },
};
