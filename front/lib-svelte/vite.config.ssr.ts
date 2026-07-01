import { svelte } from '@sveltejs/vite-plugin-svelte';
import * as Vite from 'vite';
import { defineConfig } from 'vite';
import { plateformePlugin } from './src/plateforme/plateforme.plugin';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      compilerOptions: {
        css: 'injected',
        customElement: false,
      },
    }),
    injecteNonce(),
    plateformePlugin(),
  ],
  build: {
    ssr: true,
    cssCodeSplit: false,
    outDir: 'dist/serveur',
    rollupOptions: {
      input: {
        entreprises: 'src/protection/entreprises/PresentationEntreprises.svelte',
      },
      output: {
        entryFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});

const injecteNonceWebcomponents = (code: string) => {
  let codeAvecNonce = `const nonce =
  typeof document !== 'undefined'
    ? document.querySelector('meta[property="csp-nonce"]')?.getAttribute('content')
    : null;\n${code}`;

  codeAvecNonce = codeAvecNonce
    .replace(/const (\w+)\s*=\s*\w+\(["']style["']\);/gm, (match, nomVariable) => `${match}${nomVariable}.nonce=nonce;`)
    .replace(
      /const (\w+)\s*=\s*document\.createElement\(["']style["']\);/gm,
      (match, nomVariable) => `${match}${nomVariable}.nonce=nonce;`
    );

  return codeAvecNonce;
};

function injecteNonce(): Vite.Plugin {
  return {
    name: 'injecte-nonce',
    enforce: 'post',
    generateBundle(_options, bundle) {
      console.log('📝 Ajout de la gestion du Nonce');

      for (const file of Object.values(bundle)) {
        if (file.type === 'chunk' && file.code) {
          // Remplace `const a = u("style");`
          // par `const a = u("style");a.nonce=nonce;`
          file.code = injecteNonceWebcomponents(file.code);
        }
      }
      console.log('✅');
    },
  };
}
