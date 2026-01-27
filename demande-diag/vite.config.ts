import { svelte } from '@sveltejs/vite-plugin-svelte';
import cssnano from 'cssnano';
import path, { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/wc-demande-diag.ts'),
      name: 'WebComponents',
      fileName: 'demande-diag',
      formats: ['iife'],
    },
    outDir: 'dist',
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
  ],
});
