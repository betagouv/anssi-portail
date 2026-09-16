import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import cssnano from 'cssnano';
import { readFileSync } from 'node:fs';
import path, { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { remplaceVersionsDansPhp } from './plugin/remplaceVersionsDansPhp.js';
const dirname = import.meta.dirname;

const rootPkgPath = resolve(dirname, '..', '..', 'package.json');
const pkg = JSON.parse(readFileSync(rootPkgPath, 'utf-8'));
const version_lab_ui_kit = pkg.runtimeDependencies?.['@lab-anssi/ui-kit'];

export default defineConfig({
  build: {
    lib: {
      entry: resolve(dirname, 'src/index.ts'),
      name: 'WebComponents',
      fileName: 'mini-test-vrai-faux',
      formats: ['iife'],
    },
    outDir: 'dist-' + (process.env.ENV ?? 'prod'),
  },
  resolve: {
    alias: {
      '/assets': path.resolve(dirname, '../../front/assets'),
      src: path.resolve(dirname, 'src'),
      $lib: path.resolve(dirname, 'src/lib'),
    },
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
    remplaceVersionsDansPhp(version_lab_ui_kit ?? '1.0', process.env.VERSION ?? '1.0', process.env.ENV ?? 'prod'),
  ],
});
