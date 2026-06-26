import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        css: 'injected',
        customElement: false,
      },
    }),
  ],
  build: {
    ssr: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        app: 'src/main-app.ts',
        entreprises: 'src/protection/entreprises/PresentationEntreprises.svelte',
        'centre-aide': 'src/centre-aide/CentreAide.svelte',
      },
      output: {
        entryFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
      external: ['dompurify'],
    },
  },

  server: {
    port: 3001,
  },
});
