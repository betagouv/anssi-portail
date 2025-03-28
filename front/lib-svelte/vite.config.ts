import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        'centre-aide': 'src/main-centre-aide.ts',
        'creation-compte': 'src/main-creation-compte.ts',
        'niveaux-maturite': 'src/main-niveaux-maturite.ts',
        'test-maturite': 'src/main-test-maturite.ts',
        catalogue: 'src/main-catalogue.ts',
        contacts: 'src/main-contacts.ts',
        favoris: 'src/main-favoris.ts',
        'favoris-partages': 'src/main-favoris-partages.ts',
        extrait: 'src/main-extrait.ts',
        identification: 'src/main-identification.ts',
        navigation: 'src/main-navigation.ts',
        'maturite-utilisateur': 'src/main-maturite-utilisateur.ts',
        'bouton-favori': 'src/main-bouton-favori.ts',
        'fil-ariane': 'src/main-fil-ariane.ts',
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
