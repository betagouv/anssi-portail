import { HttpStatusCode } from '@anssi-portail/axios';
import compression from 'compression';
import express, { json } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { ressourceDocumentGuide } from '../guides/ressourceDocumentGuide.js';
import { ressourceDocumentRessource } from '../ressourceDocumentRessource.js';
import { ressourceLlmsTxt } from '../ressourceLlmsTxt.js';
import { ressourcePageAccueil } from '../ressourcePageAccueil.js';
import { ressourcePageContact } from '../ressourcePageContact.js';
import { ressourcePageRessource } from '../ressourcePageRessource.js';
import { ressourcePageService } from '../ressourcePageService.js';
import { ressourcePagesJekyll } from '../ressourcePagesJekyll.js';
import { ressourcePagesJekyllConnectees } from '../ressourcePagesJekyllConnectees.js';
import { ressourceRobotsTxt } from '../ressourceRobotsTxt.js';
import { ressourceSitemapXml } from '../ressourceSitemapXml.js';
import { routesPagesConnectéesStatiques } from '../routesPagesConnectees.js';
import { enregistreRouteDansExpress } from './enregistreRoutes.js';
import { configureLesCookies } from './middlewares/cookies.js';
import { configureLaGestionDErreur } from './middlewares/gestionDErreurs.js';
import { configureLeRateLimit } from './middlewares/rateLimit.js';
import { enregistreLesRoutesAPI } from './routes/API/index.js';
import { enregistreLAuthentification } from './routes/authentification.js';
import { enregistreLesFichiersStatiques } from './routes/fichiersStatiques.js';
import { enregistreLesFinancements } from './routes/financements.js';
import { enregistreLesRedirections } from './routes/redirections.js';
import { enregistreLesRoutesStatiques, pagesStatiquesDuSitemap } from './routes/statiques.js';
import { enregistreLesAssetsKit, enregistreSvelteKit, pagesDuSitemapKit } from './routes/svelteKit.js';
import { enregistreLesVisas } from './routes/visas.js';

const creeServeur = (configurationServeur: ConfigurationServeur) => {
  const app = express();

  const { fournisseurChemin, gestionnairesRequêtesComplémentaires } = configurationServeur;
  const { attributionParcours, attributionParcoursMesure, publieMesureConsultée } =
    gestionnairesRequêtesComplémentaires;

  app.use(compression());
  app.use(json());

  const { middleware } = configurationServeur;
  app.use(middleware.ajouteMethodeEnrichissement);
  app.use(middleware.positionneLesCsp());
  app.use(middleware.interdisLaMiseEnCache);

  configureLeRateLimit(app, configurationServeur);
  configureLesCookies(app, configurationServeur);

  enregistreLesRedirections(app);
  enregistreLAuthentification(app, configurationServeur);
  enregistreLesFichiersStatiques(app, fournisseurChemin);
  enregistreLesAssetsKit(app);
  app.use(middleware.verifieModeMaintenance); // doit être après les fichiers statiques
  enregistreSvelteKit(app, configurationServeur);
  enregistreLesRoutesAPI(app, configurationServeur);

  const enregistreRoute = enregistreRouteDansExpress(app);

  enregistreRoute('/', ressourcePageAccueil(configurationServeur));
  enregistreLesRoutesStatiques(app, configurationServeur);
  enregistreLesVisas(app, configurationServeur);
  enregistreLesFinancements(app, configurationServeur);

  enregistreRoute('/favoris-partages/:id', ressourcePagesJekyll(configurationServeur, 'favoris-partages'));

  enregistreRoute('/guides/:slug', ressourcePagesJekyll(configurationServeur, 'guides'));

  enregistreRoute(`/partage-cyberdepart`, ressourcePagesJekyll(configurationServeur, 'partage-badge-cyberdepart'));

  enregistreRoute('/conseils-cyber/:slug', ressourcePagesJekyll(configurationServeur, 'conseils-cyber'));

  routesPagesConnectéesStatiques.forEach((page) =>
    enregistreRoute(`/${page}`, ressourcePagesJekyllConnectees(configurationServeur, page))
  );

  enregistreRoute(`/services`, ressourcePageService(configurationServeur));

  enregistreRoute(`/ressources`, ressourcePageRessource(configurationServeur));

  enregistreRoute(`/contacts`, ressourcePageContact(configurationServeur));

  enregistreRoute('/documents-guides', ressourceDocumentGuide(configurationServeur));
  enregistreRoute('/documents-ressources', ressourceDocumentRessource(configurationServeur));

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
  enregistreRoute(
    '/sitemap.xml',
    ressourceSitemapXml(pagesStatiquesDuSitemap, configurationServeur, pagesDuSitemapKit)
  );

  // À laisser à la fin de la fonction
  configureLaGestionDErreur(app, configurationServeur);

  return app;
};
export { creeServeur };
