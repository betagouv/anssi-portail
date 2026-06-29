import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import { plateformePlugin } from './src/plateforme/plateforme.plugin';

export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        css: 'injected',
        customElement: false,
      },
    }),
    plateformePlugin(),
  ],
  build: {
    ssr: true,
    cssCodeSplit: false,
    outDir: 'dist/serveur',
    rollupOptions: {
      input: {
        'barometre-simplifie': 'src/test-maturite/BarometreSimplifie.svelte',
        'carrousel-des-interlocuteurs': 'src/interlocuteurs/CarrouselDesInterlocuteurs.svelte',
        'centre-aide': 'src/centre-aide/CentreAide.svelte',
        'demande-diagnostic': 'src/demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte',
        'equipe-biz-dev': 'src/interlocuteurs/EquipeBizDev.svelte',
        catalogue: 'src/catalogue/CatalogueServeur.svelte',
        entreprises: 'src/protection/entreprises/PresentationEntreprises.svelte',
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
