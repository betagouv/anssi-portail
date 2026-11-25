/// <reference types="vitest/config" />

import { networkInterfaces } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { sentryVitePlugin } from '@sentry/vite-plugin';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { createLogger, defineConfig, loadEnv } from 'vite';
import { appEnvDepuisValeur } from './src/app-env.js';
import { plateformePlugin } from './src/plateforme/plateforme.plugin.js';
import { injecteNonce } from './src/utils/injecteNonce.plugin.js';

// Le `.env` est à la racine du dépôt, deux dossiers au-dessus de ce fichier, indépendamment du cwd d'où `vite` est lancé.
const racineDuDepot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

const loggerPersonnalise = createLogger();
const loggerWarnOnce = loggerPersonnalise.warnOnce;

loggerPersonnalise.warnOnce = (msg, options) => {
  const regexp =
    /assets\/.* referenced in \/assets\/.* didn't resolve at build time, it will remain unchanged to be resolved at runtime/;
  if (msg.match(regexp)) return;

  loggerWarnOnce(msg, options);
};

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, racineDuDepot, '');
  const portDev = Number(env.SVELTE_DEV_PORT ?? process.env.SVELTE_DEV_PORT ?? 3001);
  const estExposeSurLeLan = command === 'serve' && mode === 'development' && process.env.HOST === '0.0.0.0';
  const portServeur = Number(env.PORT ?? process.env.PORT ?? 3000);
  const originesLocales = [
    `http://localhost:${portServeur}`,
    ...Object.values(networkInterfaces())
      .flatMap((interfaces) => interfaces ?? [])
      .filter(({ family }) => family === 'IPv4')
      .map(({ address }) => `http://${address}:${portServeur}`),
  ];
  return {
    base: './',
    define: {
      // `loadEnv` ne lit que les fichiers `.env` présents sur le disque : sans fichier `.env`
      // (cas de la CI, où `.env` est gitignoré), il ne reprend pas la variable déjà présente
      // dans `process.env` (ex. injectée par `clever env`). D'où le fallback explicite.
      'import.meta.env.FEATURE_FLAG_BADGE_CYBERDEPART': JSON.stringify(
        env.FEATURE_FLAG_BADGE_CYBERDEPART ?? process.env.FEATURE_FLAG_BADGE_CYBERDEPART ?? 'false'
      ),
      'import.meta.env.FEATURE_FLAG_ESPACE_CONNECTE': JSON.stringify(
        env.FEATURE_FLAG_ESPACE_CONNECTE ?? process.env.FEATURE_FLAG_ESPACE_CONNECTE ?? 'false'
      ),

      'import.meta.env.APP_ENV': JSON.stringify(appEnvDepuisValeur(env.APP_ENV)),
    },
    plugins: [
      svelte(),
      sentryVitePlugin({
        disable: !process.env.SENTRY_AUTH_TOKEN || process.env.NODE_ENV !== 'production',
        project: process.env.SENTRY_PROJET,
        authToken: process.env.SENTRY_AUTH_TOKEN,
        url: process.env.SENTRY_URL,
        applicationKey: 'mes-services-cyber',
      }),
      injecteNonce(),
      plateformePlugin(),
    ],
    build: {
      cssCodeSplit: false,
      outDir: 'dist/client',
      rolldownOptions: {
        input: {
          '404': 'src/main-404.ts',
          'abonnement-infolettre': 'src/main-abonnement-infolettre.ts',
          'apres-authentification': 'src/main-apres-authentification.ts',
          'avis-utilisateur': 'src/main-avis-utilisateur.ts',
          'badge-agent-anssi': 'src/main-badge-agent-anssi.ts',
          'bandeau-maintenance': 'src/main-bandeau-maintenance.ts',
          'barometre-simplifie': 'src/main-barometre-simplifie.ts',
          'bouton-favori': 'src/main-bouton-favori.ts',
          'carrousel-des-interlocuteurs': 'src/main-carrousel-des-interlocuteurs.ts',
          'centre-aide': 'src/main-centre-aide.ts',
          'composants-ui': 'src/main-composants-ui.ts',
          'confirmation-abonnement-infolettre': 'src/main-confirmation-abonnement-infolettre.ts',
          'conseils-cyber': 'src/main-conseils-cyber.ts',
          'creation-compte': 'src/main-creation-compte.ts',
          'demande-aide-mon-aide-cyber': 'src/main-demande-aide-mon-aide-cyber.ts',
          'demande-diagnostic': 'src/main-demande-diagnostic.ts',
          'equipe-biz-dev': 'src/main-equipe-biz-dev.ts',
          'favoris-partages': 'src/main-favoris-partages.ts',
          'fil-ariane': 'src/main-fil-ariane.ts',
          'gestion-guides': 'src/main-gestion-guides.ts',
          'heros-accueil': 'src/main-heros-accueil.ts',
          'illustration-connexion-inscription': 'src/main-illustration-connexion-inscription.ts',
          'integrer-webc': 'src/main-integrer-webc.ts',
          'maturite-utilisateur': 'src/main-maturite-utilisateur.ts',
          'mini-test-hameconnage': 'src/main-mini-test-hameconnage.ts',
          'mini-test-hameconnage-test': 'src/main-mini-test-hameconnage-test.ts',
          'mini-test-reflexe-cyber': 'src/main-mini-test-reflexe-cyber.ts',
          'mini-test-reflexe-cyber-parcours': 'src/main-mini-test-reflexe-cyber-parcours.ts',
          'mini-test-vrai-faux': 'src/main-mini-test-vrai-faux.ts',
          'mini-test-vrai-faux-quiz': 'src/main-mini-test-vrai-faux-quiz.ts',
          'mini-tests': 'src/main-mini-tests.ts',
          'module-cyberdepart': 'src/main-module-cyberdepart.ts',
          'niveaux-maturite': 'src/main-niveaux-maturite.ts',
          'page-directive-nis2': 'src/main-page-directive-nis2.ts',
          'parcours-complet': 'src/main-parcours-complet.ts',
          'parcours-cyberdepart': 'src/main-parcours-cyberdepart.ts',
          'parcours-securisation': 'src/main-parcours-securisation.ts',
          'parcours-securisation-complet': 'src/main-parcours-securisation-complet.ts',
          'proteger-organisation': 'src/main-proteger-organisation.ts',
          'resultats-session-groupe': 'src/main-resultats-session-groupe.ts',
          'session-groupe': 'src/main-session-groupe.ts',
          'simulateur-nis2': 'src/main-simulateur-nis2.ts',
          'tableau-de-bord': 'src/main-tableau-de-bord.ts',
          'test-maturite': 'src/main-test-maturite.ts',
          associations: 'src/main-associations.ts',
          catalogue: 'src/main-catalogue.ts',
          collectivites: 'src/main-collectivites.ts',
          contacts: 'src/main-contacts.ts',
          entreprises: 'src/main-entreprises.ts',
          exposition: 'src/main-exposition.ts',
          favoris: 'src/main-favoris.ts',
          financements: 'src/main-financements.ts',
          guide: 'src/main-guide.ts',
          identification: 'src/main-identification.ts',
          mesure: 'src/main-mesure.ts',
          module: 'src/main-module.ts',
          navigation: 'src/main-navigation.ts',
          observatoire: 'src/main-observatoire.ts',
          sante: 'src/main-sante.ts',
          sentry: 'src/main-sentry.ts',
          statistiques: 'src/main-statistiques.ts',
        },
        output: {
          entryFileNames: `assets/[name].js`,
          assetFileNames: `assets/[name].[ext]`,
        },
      },
      sourcemap: true,
    },
    customLogger: loggerPersonnalise,
    server: {
      host: estExposeSurLeLan ? '0.0.0.0' : undefined,
      port: portDev,
      cors: estExposeSurLeLan ? { origin: originesLocales } : undefined,
    },
  };
});
