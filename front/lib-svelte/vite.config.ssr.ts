import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { plateformePlugin } from './src/plateforme/plateforme.plugin';
import { injecteNonce } from './src/utils/injecteNonce.plugin';

// https://vite.dev/config/
export default defineConfig({
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
    rollupOptions: {
      input: {
        entreprises: 'src/protection/entreprises/PresentationEntreprises.svelte',
        associations: 'src/protection/associations/PresentationAssociations.svelte',
      },
      output: {
        entryFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
