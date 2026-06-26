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
        'barometre-simplifie': 'src/test-maturite/BarometreSimplifie.svelte',
        'carrousel-des-interlocuteurs': 'src/interlocuteurs/CarrouselDesInterlocuteurs.svelte',
        'centre-aide': 'src/centre-aide/CentreAide.svelte',
        'demande-diagnostic': 'src/demande-aide-mon-aide-cyber/DemandeDiagnosticSimplifiee.svelte',
        'equipe-biz-dev': 'src/interlocuteurs/EquipeBizDev.svelte',
        catalogue: 'src/catalogue/Catalogue.svelte',
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
