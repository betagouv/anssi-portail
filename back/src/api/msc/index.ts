import { HttpStatusCode } from '@anssi-portail/axios';
import compression from 'compression';
import express, { json, NextFunction, Request, Response } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { erreurPageInterdite, erreurPageNonTrouvée, ErreurTraverséeDeChemin } from '../erreurs.js';
import { FichierInconnu } from '../fournisseurChemin.js';
import { ressourceDocumentGuide } from '../guides/ressourceDocumentGuide.js';
import { ressourceControleContenuListeConfiance } from '../ressourceControleContenuListeConfiance.js';
import { ressourceDocumentRessource } from '../ressourceDocumentRessource.js';
import { ressourceLlmsTxt } from '../ressourceLlmsTxt.js';
import { ressourcePageContact } from '../ressourcePageContact.js';
import { ressourcePageRessource } from '../ressourcePageRessource.js';
import { ressourcePageService } from '../ressourcePageService.js';
import { ressourcePagesJekyll } from '../ressourcePagesJekyll.js';
import { ressourcePagesJekyllConnectees } from '../ressourcePagesJekyllConnectees.js';
import { ressourceRobotsTxt } from '../ressourceRobotsTxt.js';
import { ressourceSitemapXml } from '../ressourceSitemapXml.js';
import { ressourceVisa } from '../ressourceVisa.js';
import { routesPagesConnecteesStatiques } from '../routesPagesConnectees.js';
import { enregistreLAuthentification } from './authentification.js';
import { configureLesCookies } from './cookies.js';
import { enregistreRouteDansExpress } from './enregistreRoutes.js';
import { enregistreLesFichiersStatiques } from './fichiersStatiques.js';
import { configureLeRateLimit } from './rateLimit.js';
import { enregistreLesRedirections } from './redirections.js';
import { enregistreLesRoutesAPI } from './routesAPI.js';

const creeServeur = (configurationServeur: ConfigurationServeur) => {
  const app = express();

  configurationServeur.adaptateurGestionErreur.initialise();

  const { fournisseurChemin, gestionnairesRequêtesComplémentaires } = configurationServeur;
  const { attributionParcours, attributionParcoursMesure, publieMesureConsultée } =
    gestionnairesRequêtesComplémentaires;

  app.use(compression());
  app.use(json());

  const { middleware } = configurationServeur;
  app.use(middleware.ajouteMethodeEnrichissement);
  app.use(middleware.positionneLesCsp());
  app.use(middleware.interdisLaMiseEnCache);
  app.use(middleware.verifieModeMaintenance);

  configureLeRateLimit(app, configurationServeur);
  configureLesCookies(app, configurationServeur);

  enregistreLesRedirections(app);
  enregistreLAuthentification(app, configurationServeur);
  enregistreLesFichiersStatiques(app, fournisseurChemin);
  enregistreLesRoutesAPI(app, configurationServeur);

  const enregistreRoute = enregistreRouteDansExpress(app);

  enregistreRoute('/financements', (requete, reponse) => {
    const id = requete.query.idFinancement;
    if (Object.keys(requete.query).length > 0 && id) {
      // on garde la redirection pour ne pas casser les liens existants
      return reponse.redirect(HttpStatusCode.MovedPermanently, `/financements/${id}`);
    }
    reponse
      .contentType('text/html')
      .status(HttpStatusCode.Ok)
      .envoieFichierEnrichi(fournisseurChemin.jekyll.page('financements'));
  });

  const routesStatiques = [
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
    'cyberdepart',
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
  ];

  if (configurationServeur.adaptateurEnvironnement.fonctionnalites().nis2().afficheSimulateur()) {
    routesStatiques.push('simulateur-nis2');
  }

  routesStatiques.forEach((page) => enregistreRoute(`/${page}`, ressourcePagesJekyll(configurationServeur, page)));

  enregistreRoute('/financements/:id', ressourcePagesJekyll(configurationServeur, 'financements'));

  enregistreRoute('/favoris-partages/:id', ressourcePagesJekyll(configurationServeur, 'favoris-partages'));

  enregistreRoute('/guides/:slug', ressourcePagesJekyll(configurationServeur, 'guides'));

  enregistreRoute(`/partage-cyberdepart`, ressourcePagesJekyll(configurationServeur, 'partage-badge-cyberdepart'));

  enregistreRoute('/conseils-cyber/:slug', ressourcePagesJekyll(configurationServeur, 'conseils-cyber'));

  routesPagesConnecteesStatiques.forEach((page) =>
    enregistreRoute(`/${page}`, ressourcePagesJekyllConnectees(configurationServeur, page))
  );

  enregistreRoute(`/services`, ressourcePageService(configurationServeur));

  enregistreRoute(`/ressources`, ressourcePageRessource(configurationServeur));

  enregistreRoute(`/contacts`, ressourcePageContact(configurationServeur));

  enregistreRoute('/documents-guides', ressourceDocumentGuide(configurationServeur));
  enregistreRoute('/documents-ressources', ressourceDocumentRessource(configurationServeur));

  enregistreRoute('/visas/tl-fr.sha2', ressourceControleContenuListeConfiance({ version: 'v5' }));
  enregistreRoute('/visas/tl-fr_v6.sha2', ressourceControleContenuListeConfiance({ version: 'v6' }));
  enregistreRoute('/visas', ressourceVisa(configurationServeur));

  enregistreRoute('/module-cyberdepart', (_, reponse) => reponse.redirect(HttpStatusCode.SeeOther, '/modules/1'));
  enregistreRoute(
    '/modules/1',
    ressourcePagesJekyllConnectees(configurationServeur, 'module-cyberdepart', [attributionParcours('allégé')])
  );
  enregistreRoute(
    '/modules/:id',
    ressourcePagesJekyllConnectees(configurationServeur, 'modules', [attributionParcours('complet')])
  );
  enregistreRoute(
    '/parcours-complet',
    ressourcePagesJekyllConnectees(configurationServeur, 'parcours-complet', [attributionParcours('complet')])
  );
  enregistreRoute(`/partage-cyberdepart`, ressourcePagesJekyll(configurationServeur, 'partage-badge-cyberdepart'));
  enregistreRoute(
    '/mesures/:id',
    ressourcePagesJekyllConnectees(configurationServeur, 'mesures', [publieMesureConsultée, attributionParcoursMesure])
  );

  enregistreRoute('/robots.txt', ressourceRobotsTxt(configurationServeur));
  enregistreRoute('/llms.txt', ressourceLlmsTxt(configurationServeur));
  enregistreRoute('/sitemap.xml', ressourceSitemapXml(routesStatiques, configurationServeur));

  app.use((erreur: unknown, _requete: Request, reponse: Response, suite: NextFunction) => {
    if (erreur instanceof FichierInconnu) {
      return erreurPageNonTrouvée(reponse, fournisseurChemin);
    }
    if (erreur instanceof ErreurTraverséeDeChemin) {
      return erreurPageInterdite(reponse);
    }
    suite(erreur);
  });

  // A laisser à la fin de la fonction
  app.use(configurationServeur.adaptateurGestionErreur.controleurErreurs);

  // A laisser à la fin de la fonction
  app.use((_requete: Request, reponse: Response) => {
    return erreurPageNonTrouvée(reponse, fournisseurChemin);
  });

  return app;
};
export { creeServeur };
