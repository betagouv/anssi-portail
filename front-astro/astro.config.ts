// ./front-astro/astro.config.ts
import svelte, { vitePreprocess } from '@astrojs/svelte';
import { defineConfig } from 'astro/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootPkgPath = resolve('..', 'package.json');
const pkg = JSON.parse(readFileSync(rootPkgPath, 'utf-8'));
const ui_kit_version = pkg.runtimeDependencies?.['@lab-anssi/ui-kit'];

export default defineConfig({
  integrations: [svelte({ preprocess: [vitePreprocess()] })],
  output: 'static',
  vite: {
    define: {
      'import.meta.env.PUBLIC_UI_KIT_VERSION': JSON.stringify(ui_kit_version),
    },
    server: {
      hmr: {
        clientPort: 3000,
        port: 4321,
      },
    },
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
  },
});
