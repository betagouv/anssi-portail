import { Express } from 'express';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { ressourcePagesJekyll } from '../../ressourcePagesJekyll.js';
import { enregistreRouteDansExpress } from '../enregistreRoutes.js';

export const routesStatiques = [
  '',
  'catalogue',
  'test-maturite',
  'niveaux-maturite',
  'apres-authentification',
  'a-propos',
  'mentions-legales',
  'confidentialite',
  'cgu',
  'accessibilite',
  'creation-compte',
  'securite',
  'statistiques',
  'inscription',
  'cyberdepart/diagnostic-gratuit',
  'session-groupe',
  'resultats-session-groupe',
  'prestataires-labellises',
  'contacts',
  'nis2',
  'collectivites',
  'associations',
  'entreprises',
  'sante',
  'abonnement-infolettre',
  'confirmation-abonnement-infolettre',
  'faire-le-test',
  'vrai-faux',
  'vrai-faux/quiz',
  'reflexes-cyber-en-ligne',
  'reflexes-cyber-en-ligne/parcours',
  'exposition',
  'conseils-cyber',
  'kit-relais',
  'parcours-securisation',
  'parcours-cyberdepart',
  'parcours-securisation-complet',
  'simulateur-nis2',
  'integrer-webc',
  'hameconnage',
  'hameconnage/test',
];

export const enregistreLesRoutesStatiques = (app: Express, configurationServeur: ConfigurationServeur) => {
  const enregistreRoute = enregistreRouteDansExpress(app);

  routesStatiques.forEach((page) => enregistreRoute(`/${page}`, ressourcePagesJekyll(configurationServeur, page)));
};
