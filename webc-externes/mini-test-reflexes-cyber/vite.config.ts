import { readFileSync } from 'node:fs';
import { findPackageJSON } from 'node:module';
import { resolve } from 'node:path';
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import cssnano from 'cssnano';
import { defineConfig } from 'vite';
import { remplaceVersionsDansPhp } from './plugin/remplaceVersionsDansPhp.js';

const dirname = import.meta.dirname;
const bibliothèqueSvelte = resolve(dirname, '../../front/lib-svelte');
const cheminPaquetKit = findPackageJSON('@lab-anssi/ui-kit', resolve(bibliothèqueSvelte, 'package.json'));
if (!cheminPaquetKit) throw new Error('Paquet @lab-anssi/ui-kit introuvable');
const { version: versionUiKit } = JSON.parse(readFileSync(cheminPaquetKit, 'utf-8'));
const { version } = JSON.parse(readFileSync(resolve(dirname, 'package.json'), 'utf-8'));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(dirname, 'src/index.ts'),
      name: 'WebComponents',
      fileName: 'mini-test-reflexes-cyber',
      formats: ['iife'],
    },
    outDir: 'dist-' + (process.env.ENV ?? 'prod'),
  },
  resolve: {
    alias: [
      { find: '/assets', replacement: resolve(dirname, '../../front/assets') },
      {
        find: /^\$plateforme\/(.+)$/,
        replacement: resolve(bibliothèqueSvelte, 'src/plateforme/$1.client.ts'),
      },
    ],
  },
  css: {
    postcss: {
      plugins: [
        cssnano({
          preset: [
            'default',
            {
              discardEmpty: true,
              discardComments: {
                removeAll: true,
              },
            },
          ],
        }),
      ],
    },
    preprocessorOptions: {
      scss: {
        loadPaths: [
          '../../front/assets/fonts',
          '../../front/assets/icones',
          '../../front/assets/images',
          '../../front/assets/styles',
        ],
        quietDeps: true,
      },
    },
  },
  plugins: [
    svelte({
      compilerOptions: { customElement: true },
      emitCss: true,
      preprocess: vitePreprocess(),
    }),
    remplaceVersionsDansPhp(versionUiKit, process.env.VERSION ?? version, process.env.ENV ?? 'prod'),
  ],
});
