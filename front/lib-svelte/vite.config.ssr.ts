import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, UserConfig } from 'vite';
import { rollupOptions } from './rollupOptions';
import { plateformePlugin } from './src/plateforme/plateforme.plugin';
import { injecteNonce } from './src/utils/injecteNonce.plugin';

// https://vite.dev/config/
export const configSsr: UserConfig = {
  plugins: [
    svelte({
      compilerOptions: {
        css: 'injected',
        customElement: false,
      },
    }),
    injecteNonce(),
    plateformePlugin(),
  ],
  build: {
    ssr: true,
    cssCodeSplit: false,
    outDir: 'dist/serveur',
    rollupOptions,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
} as const;

export default defineConfig(configSsr);
