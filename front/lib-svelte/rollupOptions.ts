import { UserConfig } from 'vite';

export const rollupOptions: NonNullable<UserConfig['build']>['rollupOptions'] = {
  input: {
    entreprises: 'src/protection/entreprises/PresentationEntreprises.svelte',
    associations: 'src/protection/associations/PresentationAssociations.svelte',
  },
  output: {
    entryFileNames: `assets/[name].js`,
    assetFileNames: `assets/[name].[ext]`,
  },
};
