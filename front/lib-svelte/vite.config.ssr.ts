import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, UserConfig } from 'vite';
import { plateformePlugin } from './src/plateforme/plateforme.plugin';
import { emetComposantsAutorisés } from './src/utils/composantsAutorises.plugin';
import { injecteNonce } from './src/utils/injecteNonce.plugin';

const rollupOptions: NonNullable<UserConfig['build']>['rollupOptions'] = {
  input: {
    entreprises: 'src/protection/entreprises/PresentationEntreprises.svelte',
    associations: 'src/protection/associations/PresentationAssociations.svelte',
    navigation: 'src/navigation/Navigation.svelte',
    collectivites: 'src/protection/collectivites/PresentationCollectivites.svelte',
    catalogue: 'src/catalogue/Catalogue.svelte',
    'page-directive-nis2': '/src/nis2/PageNis2.svelte',
    guide: 'src/catalogue/guides/Guide.svelte',
    financements: 'src/financements/Financements.svelte',
    'page-crisp': 'src/page-crisp/PageCrisp.svelte',
    'fil-ariane': 'src/ui/FilAriane.svelte',
    'test-maturite': 'src/test-maturite/TestMaturite.svelte',
  },
  output: {
    entryFileNames: `assets/[name].js`,
    assetFileNames: `assets/[name].[ext]`,
  },
  external: [
    'svelte',
    /^svelte\//, // couvre svelte/internal/server, svelte/store, etc.
  ],
};

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
    emetComposantsAutorisés(
      Object.keys(rollupOptions?.input ?? {}),
      '../../back/src/infra/enrichissement/composantsAutorises.genere.ts'
    ),
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
