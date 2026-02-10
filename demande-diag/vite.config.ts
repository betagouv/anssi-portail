import { svelte } from '@sveltejs/vite-plugin-svelte';
import cssnano from 'cssnano';
import { readFileSync } from 'node:fs';
import path, { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { remplaceVersionsDansPhp } from './plugin/remplaceVersionsDansPhp';

const rootPkgPath = resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(readFileSync(rootPkgPath, 'utf-8'));
const version_lab_ui_kit = pkg.runtimeDependencies?.['@lab-anssi/ui-kit'];

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'WebComponents',
      fileName: 'demande-diag',
      formats: ['iife'],
    },
    outDir: 'dist-' + (process.env.ENV ?? 'prod'),
  },
  resolve: {
    alias: {
      '/assets': path.resolve(__dirname, '../front/assets'),
      src: path.resolve(__dirname, 'src'),
      $lib: path.resolve(__dirname, 'src/lib'),
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
          '../front/assets/fonts',
          '../front/assets/icones',
          '../front/assets/images',
          '../front/assets/styles',
        ],
        quietDeps: true,
      },
    },
  },
  plugins: [
    svelte({
      compilerOptions: { customElement: true },
      emitCss: true,
    }),
    remplaceVersionsDansPhp(
      version_lab_ui_kit ?? '1.0',
      process.env.VERSION ?? '1.0',
      process.env.ENV ?? 'prod'
    ),
  ],
});
