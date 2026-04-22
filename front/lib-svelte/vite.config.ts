import { sentryVitePlugin } from '@sentry/vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { createLogger, defineConfig } from 'vite';
import * as Vite from 'vite';

const loggerPersonnalise = createLogger();
const loggerWarnOnce = loggerPersonnalise.warnOnce;

loggerPersonnalise.warnOnce = (msg, options) => {
  const regexp =
    /assets\/.* referenced in \/assets\/.* didn't resolve at build time, it will remain unchanged to be resolved at runtime/;
  if (msg.match(regexp)) return;

  loggerWarnOnce(msg, options);
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    svelte(),
    sentryVitePlugin({
      disable: !process.env.SENTRY_AUTH_TOKEN || process.env.NODE_ENV !== 'production',
      project: process.env.SENTRY_PROJET,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      url: process.env.SENTRY_URL,
    }),
    injecteNonce(),
  ],
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      input: {
        'avis-utilisateur': 'src/main-avis-utilisateur.ts',
        'centre-aide': 'src/main-centre-aide.ts',
        'creation-compte': 'src/main-creation-compte.ts',
        'niveaux-maturite': 'src/main-niveaux-maturite.ts',
        'test-maturite': 'src/main-test-maturite.ts',
        'demande-aide-mon-aide-cyber': 'src/main-demande-aide-mon-aide-cyber.ts',
        catalogue: 'src/main-catalogue.ts',
        contacts: 'src/main-contacts.ts',
        favoris: 'src/main-favoris.ts',
        'favoris-partages': 'src/main-favoris-partages.ts',
        identification: 'src/main-identification.ts',
        navigation: 'src/main-navigation.ts',
        'maturite-utilisateur': 'src/main-maturite-utilisateur.ts',
        'bouton-favori': 'src/main-bouton-favori.ts',
        'fil-ariane': 'src/main-fil-ariane.ts',
        'page-crisp': 'src/main-page-crisp.ts',
        'session-groupe': 'src/main-session-groupe.ts',
        'resultats-session-groupe': 'src/main-resultats-session-groupe.ts',
        'badge-agent-anssi': 'src/main-badge-agent-anssi.ts',
        'bandeau-maintenance': 'src/main-bandeau-maintenance.ts',
        statistiques: 'src/main-statistiques.ts',
        financements: 'src/main-financements.ts',
        guide: 'src/main-guide.ts',
        'demande-diagnostic': 'src/main-demande-diagnostic.ts',
        'barometre-simplifie': 'src/main-barometre-simplifie.ts',
        'page-directive-nis2': 'src/main-page-directive-nis2.ts',
        'simulateur-nis2': 'src/main-simulateur-nis2.ts',
        collectivites: 'src/main-collectivites.ts',
        associations: 'src/main-associations.ts',
        entreprises: 'src/main-entreprises.ts',
        'carrousel-des-interlocuteurs': 'src/main-carrousel-des-interlocuteurs.ts',
        'equipe-biz-dev': 'src/main-equipe-biz-dev.ts',
        sante: 'src/main-sante.ts',
        'gestion-guides': 'src/main-gestion-guides.ts',
        sentry: 'src/main-sentry.ts',
        'confirmation-abonnement-infolettre': 'src/main-confirmation-abonnement-infolettre.ts',
        'abonnement-infolettre': 'src/main-abonnement-infolettre.ts',
        'composants-ui': 'src/main-composants-ui.ts',
      },
      output: {
        entryFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },

    sourcemap: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  customLogger: loggerPersonnalise,
  server: {
    port: 3001,
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
