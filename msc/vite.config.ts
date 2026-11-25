import { readFileSync } from 'node:fs';
import path from 'node:path';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, loadEnv } from 'vite';
import { appEnvDepuisValeur } from '../front/lib-svelte/src/app-env.ts';
import { plateformePlugin } from '../front/lib-svelte/src/plateforme/plateforme.plugin.ts';
import { injecteNonce } from '../front/lib-svelte/src/utils/injecteNonce.plugin.ts';

const composants = path.resolve(import.meta.dirname, '../front/lib-svelte/src');
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, '..', ['APP_ENV', 'FEATURE_FLAG_']), ...process.env };
  const kitUI = JSON.parse(
    readFileSync(new URL('./node_modules/@lab-anssi/ui-kit/package.json', import.meta.url), 'utf8')
  );
  return {
    css: {
      preprocessorOptions: { scss: { loadPaths: [path.resolve(import.meta.dirname, '../front/assets/styles')] } },
    },
    ssr: { external: ['isomorphic-dompurify'] },
    resolve: { alias: { $msc: composants, $lib: path.resolve(import.meta.dirname, 'src/lib') }, dedupe: ['svelte'] },
    define: {
      'import.meta.env.MSC_SVELTEKIT': 'true',
      'import.meta.env.VERSION_KIT_UI': JSON.stringify(kitUI.version),
      'import.meta.env.FEATURE_FLAG_ESPACE_CONNECTE': JSON.stringify(env.FEATURE_FLAG_ESPACE_CONNECTE ?? 'false'),
      'import.meta.env.APP_ENV': JSON.stringify(appEnvDepuisValeur(env.APP_ENV)),
    },
    plugins: [
      injecteNonce(),
      plateformePlugin(path.join(composants, 'plateforme')),
      sveltekit({
        preprocess: vitePreprocess(),
        adapter: adapter({ out: 'dist', precompress: false }),
        csp: { mode: 'nonce', directives: { 'script-src': ['self'], 'style-src': ['self'] } },
      }),
      sentryVitePlugin({
        applicationKey: 'mes-services-cyber',
        telemetry: false,
        sourcemaps: { disable: !process.env.CI || !process.env.SENTRY_AUTH_TOKEN },
        release: {
          create: Boolean(process.env.CI && process.env.SENTRY_AUTH_TOKEN),
          finalize: Boolean(process.env.CI && process.env.SENTRY_AUTH_TOKEN),
        },
        project: process.env.SENTRY_PROJET,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        url: process.env.SENTRY_URL,
      }),
    ],
    build: { sourcemap: 'hidden' },
  };
});
