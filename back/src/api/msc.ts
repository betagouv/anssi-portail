import { HttpStatusCode } from '@anssi-portail/axios';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express, { json, NextFunction, Request, RequestHandler, Response } from 'express';
import { IpFilter } from 'express-ipfilter';
import rateLimit from 'express-rate-limit';
import { ConfigurationServeur } from './configurationServeur.js';
import { erreurPageInterdite, erreurPageNonTrouvée, ErreurTraverséeDeChemin } from './erreurs.js';
import { ressourceFavori } from './favoris/ressourceFavori.js';
import { ressourceFavoris } from './favoris/ressourceFavoris.js';
import { ressourceFavorisPartages } from './favoris/ressourceFavorisPartages.js';
import { FichierInconnu, FournisseurChemin } from './fournisseurChemin.js';
import { ressourceDocumentGuide } from './guides/ressourceDocumentGuide.js';
import { ressourceDocumentsGuide } from './guides/ressourceDocumentsGuide.js';
import { ressourceGuide } from './guides/ressourceGuide.js';
import { ressourceGuides } from './guides/ressourceGuides.js';
import { ressourceGuidesMemesCollections } from './guides/ressourceGuidesMemesCollections.js';
import { ressourceAvisMesure } from './mesures/ressourceAvisMesure.js';
import { ressourceMesure } from './mesures/ressourceMesure.js';
import { ressourceMesureCsv } from './mesures/ressourceMesureCsv.js';
import { ressourceModule } from './mesures/ressourceModule.js';
import { ressourceParcours } from './mesures/ressourceParcours.js';
import { ressourceParcoursComplet } from './mesures/ressourceParcoursComplet.js';
import { ressourcePriseEnCompte } from './mesures/ressourcePriseEnCompte.js';
import { ressourceRécompensesCyberDépart } from './mesures/ressourceRecompensesCyberDepart/ressourceRecompensesCyberDepart.js';
import { ressourceDemandesAide } from './mon-aide-cyber/ressourceDemandesAide.js';
import { ressourceExigencesNis2 } from './nis2/ressourceExigencesNis2.js';
import { ressourceExigencesNis2Csv } from './nis2/ressourceExigencesNis2Csv.js';
import { ressourceSimulateurNis2 } from './nis2/ressourceSimulateurNis2.js';
import { ressourceApresAuthentificationOIDC } from './oidc/ressourceApresAuthentificationOIDC.js';
import { ressourceApresDeconnexionOIDC } from './oidc/ressourceApresDeconnexionOIDC.js';
import { ressourceConnexionOIDC } from './oidc/ressourceConnexionOIDC.js';
import { ressourceDeconnexionOIDC } from './oidc/ressourceDeconnexionOIDC.js';
import { ressourceAbonnementInfolettre } from './ressourceAbonnementInfolettre.js';
import { ressourceAnnuaireDepartements } from './ressourceAnnuaireDepartements.js';
import { ressourceAnnuaireOrganisations } from './ressourceAnnuaireOrganisations.js';
import { ressourceAnnuaireRegions } from './ressourceAnnuaireRegions.js';
import { ressourceAnnuaireSecteursActivite } from './ressourceAnnuaireSecteursActivite.js';
import { ressourceAnnuaireTranchesEffectif } from './ressourceAnnuaireTranchesEffectif.js';
import { ressourceAvisUtilisateur } from './ressourceAvisUtilisateur.js';
import { ressourceControleContenuListeConfiance } from './ressourceControleContenuListeConfiance.js';
import { ressourceDocumentRessource } from './ressourceDocumentRessource.js';
import { ressourceFinancement } from './ressourceFinancement.js';
import { ressourceFinancements } from './ressourceFinancements.js';
import { ressourceInformationsCreationCompte } from './ressourceInformationsCreationCompte.js';
import { ressourceInfosSite } from './ressourceInfosSite.js';
import { ressourcePageConnexion } from './ressourcePageConnexion.js';
import { ressourcePageContact } from './ressourcePageContact.js';
import { ressourcePageCrisp } from './ressourcePageCrisp.js';
import { ressourcePageRessource } from './ressourcePageRessource.js';
import { ressourcePageService } from './ressourcePageService.js';
import { ressourcePagesJekyll } from './ressourcePagesJekyll.js';
import { ressourcePagesJekyllConnectees } from './ressourcePagesJekyllConnectees.js';
import { ressourceProfil } from './ressourceProfil.js';
import { ressourceRetoursExperience } from './ressourceRetoursExperience.js';
import { ressourceRobotsTxt } from './ressourceRobotsTxt.js';
import { ressourceSanteGuides } from './ressourceSanteGuides.js';
import { ressourceSitemapXml } from './ressourceSitemapXml.js';
import { ressourceStatistiques } from './ressourceStatistiques.js';
import { ressourceStatistiquesDiagnostic } from './ressourceStatistiquesDiagnostic.js';
import { ressourceUtilisateurs } from './ressourceUtilisateurs.js';
import { ressourceVisa } from './ressourceVisa.js';
import { routesPagesConnecteesStatiques } from './routesPagesConnectees.js';
import { ressourceDernierResultatDeTest } from './testMaturite/ressourceDernierResultatDeTest.js';
import { ressourceRepartitionDesResultatsDeTest } from './testMaturite/ressourceRepartitionDesResultatsDeTest.js';
import { ressourceResultatDeTest } from './testMaturite/ressourceResultatDeTest.js';
import { ressourceResultatsDeTest } from './testMaturite/ressourceResultatsDeTest.js';
import { ressourceResultatsSessionDeGroupe } from './testMaturite/ressourceResultatsSessionDeGroupe.js';
import { ressourceSessionDeGroupe } from './testMaturite/ressourceSessionDeGroupe.js';
import { ressourceSessionsDeGroupe } from './testMaturite/ressourceSessionsDeGroupe.js';

const creeServeur = (configurationServeur: ConfigurationServeur) => {
  const app = express();

  configurationServeur.adaptateurGestionErreur.initialise(app);

  const { fournisseurChemin } = configurationServeur;

  app.use(compression());

  app.use(configurationServeur.middleware.ajouteMethodeEnrichissement);

  app.use(configurationServeur.middleware.positionneLesCsp());

  app.use(configurationServeur.middleware.interdisLaMiseEnCache);

  const limiteRequetesParMinuteGlobal = rateLimit({
    windowMs: 60 * 1000,
    limit: configurationServeur.reseau.maxRequetesParMinutes,
  });
  const limiteRequetesParMinuteAPI = rateLimit({
    windowMs: 60 * 1000,
    limit: configurationServeur.reseau.maxRequetesParMinuteAPI,
  });
  app.set('trust proxy', configurationServeur.reseau.trustProxy);
  app.use(limiteRequetesParMinuteGlobal);

  if (configurationServeur.reseau.ipAutorisees) {
    app.use(
      IpFilter(configurationServeur.reseau.ipAutorisees, {
        detectIp: (request) => {
          const forwardedFor = request.headers['x-forwarded-for'];
          if (typeof forwardedFor === 'string') {
            const ips = forwardedFor
              .split(',')
              .map((ip) => ip.trim())
              .filter((ip) => ip !== '');

            if (ips.length > 0) {
              const ipWaf = ips[ips.length - 1];
              return ipWaf;
            }
          }
          return 'interdire';
        },
        mode: 'allow',
        log: false,
      })
    );
  }

  app.use(
    cookieSession({
      name: 'session',
      sameSite: true,
      secret: configurationServeur.adaptateurEnvironnement.secrets().cookie(),
      secure: configurationServeur.adaptateurEnvironnement.nodeEnv() !== 'developpement',
      signed: configurationServeur.adaptateurEnvironnement.nodeEnv() !== 'developpement',
    })
  );

  app.use(cookieParser());
  app.use(json());

  [
    ['/aPropos', '/a-propos'],
    ['/directive-nis2', '/nis2'],
    ['/guides', '/catalogue'],
    ['/mentionsLegales', '/mentions-legales'],
    ['/guides/la-defense-en-profondeur-appliquee-aux-systemes-dinformation', '/guides/essentiels-defense-profondeur'],
    ['/services/mon-espace-nis2.html', '/nis2'],
  ].forEach(([precedent, nouveau]: string[]) => {
    app.use(precedent, (requete: Request, reponse: Response, suite: NextFunction) => {
      if (requete.originalUrl === precedent || requete.originalUrl === `${precedent}/`) {
        return reponse.redirect(HttpStatusCode.MovedPermanently, nouveau);
      }
      suite();
    });
  });

  const enregistreRoute = (chemin: string, ...gestionnaires: RequestHandler[]) => {
    const redirigeSansSlashFinal: RequestHandler = (requête, réponse, suite) => {
      const cheminRequête = requête.originalUrl.split('?', 1)[0];

      const motifPlusieursSlashsdAffilé: RegExp = /^\/{2,}$/;
      const estRacineAvecPlusieursSlashs = chemin === '/' && motifPlusieursSlashsdAffilé.test(cheminRequête);

      const paramètres = requête.originalUrl.slice(cheminRequête.length);

      if (estRacineAvecPlusieursSlashs) {
        return réponse.redirect(HttpStatusCode.PermanentRedirect, `/${paramètres}`);
      }

      if (chemin !== '/' && cheminRequête.endsWith('/')) {
        const motifSlashFinal: RegExp = /\/+$/;
        const cheminNormalisé = cheminRequête.replace(motifSlashFinal, '');

        return réponse.redirect(HttpStatusCode.PermanentRedirect, `${cheminNormalisé}${paramètres}`);
      }

      suite();
    };

    return app.use(chemin, redirigeSansSlashFinal, ...gestionnaires);
  };

  const sertLesFichiersStatiques = (
    fournisseurChemin: FournisseurChemin['jekyll']['assets' | 'scripts' | 'libSvelte' | 'favicon']
  ) =>
    express.static(fournisseurChemin(), {
      setHeaders: (réponse: Response) =>
        réponse.setHeader('cache-control', process.env.CACHE_CONTROL_FICHIERS_STATIQUES || 'no-store'),
    });

  enregistreRoute(`/assets`, cors(), sertLesFichiersStatiques(fournisseurChemin.jekyll.assets));
  enregistreRoute('/scripts', sertLesFichiersStatiques(fournisseurChemin.jekyll.scripts));
  enregistreRoute('/lib-svelte', sertLesFichiersStatiques(fournisseurChemin.jekyll.libSvelte));
  enregistreRoute('/favicon.ico', sertLesFichiersStatiques(fournisseurChemin.jekyll.favicon));

  app.use(configurationServeur.middleware.verifieModeMaintenance);

  enregistreRoute('/financements', (requete, reponse) => {
    const id = requete.query.idFinancement;
    if (Object.keys(requete.query).length > 0 && id) {
      // on garde la redirection pour ne pas casser les liens existants
      return reponse.redirect(HttpStatusCode.MovedPermanently, `/financements/${id}`);
    }
    reponse.contentType('text/html').status(200).envoieFichierEnrichi(fournisseurChemin.jekyll.page('financements'));
  });

  const routesStatiques = [
    '',
    'catalogue',
    'parcours-debuter',
    'parcours-approfondir',
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
    'promouvoir-messervicescyber',
    'promouvoir-diagnostic-cyber',
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
  ];

  routesStatiques
    .concat(
      configurationServeur.adaptateurEnvironnement.fonctionnalites().nis2().afficheSimulateur()
        ? ['simulateur-nis2']
        : []
    )
    .forEach((page) => enregistreRoute(`/${page}`, ressourcePagesJekyll(configurationServeur, page)));

  enregistreRoute('/financements/:id', ressourcePagesJekyll(configurationServeur, 'financements'));

  enregistreRoute('/favoris-partages/:id', ressourcePagesJekyll(configurationServeur, 'favoris-partages'));

  enregistreRoute('/guides/:slug', ressourcePagesJekyll(configurationServeur, 'guides'));

  routesPagesConnecteesStatiques.forEach((page) =>
    enregistreRoute(`/${page}`, ressourcePagesJekyllConnectees(configurationServeur, page))
  );

  enregistreRoute('/connexion', ressourcePageConnexion(configurationServeur));

  enregistreRoute(`/services`, ressourcePageService(configurationServeur));

  enregistreRoute(`/ressources`, ressourcePageRessource(configurationServeur));

  enregistreRoute(`/contacts`, ressourcePageContact(configurationServeur));

  enregistreRoute('/oidc/connexion', ressourceConnexionOIDC(configurationServeur));

  enregistreRoute('/oidc/apres-authentification', ressourceApresAuthentificationOIDC(configurationServeur));

  enregistreRoute('/oidc/deconnexion', ressourceDeconnexionOIDC(configurationServeur));

  enregistreRoute('/oidc/apres-deconnexion', ressourceApresDeconnexionOIDC());

  app.use('/api', limiteRequetesParMinuteAPI);

  enregistreRoute('/api/profil', ressourceProfil(configurationServeur));

  enregistreRoute('/api/utilisateurs', ressourceUtilisateurs(configurationServeur));

  enregistreRoute('/api/mon-aide-cyber/demandes-aide', ressourceDemandesAide(configurationServeur));

  enregistreRoute('/api/favoris', ressourceFavoris(configurationServeur), ressourceFavori(configurationServeur));

  enregistreRoute('/api/favoris-partages', ressourceFavorisPartages(configurationServeur));

  enregistreRoute('/api/informations-creation-compte', ressourceInformationsCreationCompte(configurationServeur));

  enregistreRoute(
    '/api/resultats-test',
    ressourceResultatsDeTest(configurationServeur),
    ressourceResultatDeTest(configurationServeur)
  );
  enregistreRoute('/api/resultats-test/dernier', ressourceDernierResultatDeTest(configurationServeur));

  enregistreRoute(
    '/api/sessions-groupe',
    ressourceSessionsDeGroupe(configurationServeur),
    ressourceSessionDeGroupe(configurationServeur),
    ressourceResultatsSessionDeGroupe(configurationServeur)
  );

  enregistreRoute('/api/annuaire/organisations', ressourceAnnuaireOrganisations(configurationServeur));

  enregistreRoute('/api/annuaire/departements', ressourceAnnuaireDepartements(configurationServeur));

  enregistreRoute('/api/annuaire/regions', ressourceAnnuaireRegions(configurationServeur));

  enregistreRoute('/api/annuaire/secteurs-activite', ressourceAnnuaireSecteursActivite(configurationServeur));

  enregistreRoute('/api/annuaire/tranches-effectif', ressourceAnnuaireTranchesEffectif(configurationServeur));

  enregistreRoute('/api/pages-crisp', ressourcePageCrisp(configurationServeur));

  enregistreRoute('/api/infos-site', ressourceInfosSite(configurationServeur));

  enregistreRoute('/api/retours-experience', ressourceRetoursExperience(configurationServeur));

  enregistreRoute('/api/statistiques', ressourceStatistiques(configurationServeur));

  enregistreRoute('/api/repartition-resultats-test', ressourceRepartitionDesResultatsDeTest(configurationServeur));

  enregistreRoute('/api/avis-utilisateur', ressourceAvisUtilisateur(configurationServeur));

  enregistreRoute(
    '/api/financements',
    ressourceFinancements(configurationServeur),
    ressourceFinancement(configurationServeur)
  );

  enregistreRoute(
    '/api/guides',
    ressourceGuides(configurationServeur),
    ressourceGuide(configurationServeur),
    ressourceGuidesMemesCollections(configurationServeur),
    ressourceDocumentsGuide(configurationServeur)
  );

  enregistreRoute('/documents-guides', ressourceDocumentGuide(configurationServeur));
  enregistreRoute('/documents-ressources', ressourceDocumentRessource(configurationServeur));

  enregistreRoute('/visas/tl-fr.sha2', ressourceControleContenuListeConfiance());
  enregistreRoute('/visas', ressourceVisa(configurationServeur));

  enregistreRoute('/api/diagnostic/statistiques', ressourceStatistiquesDiagnostic());

  enregistreRoute('/api/exigences-nis2', ressourceExigencesNis2(configurationServeur));
  enregistreRoute('/api/exigences-nis2.csv', ressourceExigencesNis2Csv(configurationServeur));

  if (configurationServeur.adaptateurEnvironnement.fonctionnalites().nis2().afficheSimulateur())
    enregistreRoute('/api/simulateur-nis2', ressourceSimulateurNis2(configurationServeur));

  enregistreRoute('/api/sante-guides', ressourceSanteGuides(configurationServeur));

  enregistreRoute('/api/abonnement-infolettre', ressourceAbonnementInfolettre(configurationServeur));

  enregistreRoute(
    '/api/cyberdepart/attestation_badge_cyberdepart.zip',
    ressourceRécompensesCyberDépart(configurationServeur)
  );

  const parcoursActivé = configurationServeur.adaptateurEnvironnement
    .fonctionnalites()
    .parcoursDeSecurisation()
    .estActif();
  if (parcoursActivé) {
    enregistreRoute(
      '/api/mesures',
      ressourceMesure(configurationServeur),
      ressourceAvisMesure(configurationServeur),
      ressourcePriseEnCompte(configurationServeur)
    );
    enregistreRoute('/parcours-securisation', ressourcePagesJekyll(configurationServeur, 'parcours-securisation'));
    enregistreRoute('/api/mesures.csv', ressourceMesureCsv(configurationServeur));
    enregistreRoute('/api/modules', ressourceModule(configurationServeur));
    enregistreRoute('/module-cyberdepart', (_, reponse) => reponse.redirect(303, '/modules/1'));
    enregistreRoute('/modules/1', ressourcePagesJekyllConnectees(configurationServeur, 'module-cyberdepart'));
    enregistreRoute('/modules/:id', ressourcePagesJekyllConnectees(configurationServeur, 'modules'));
    enregistreRoute('/parcours-complet', ressourcePagesJekyllConnectees(configurationServeur, 'parcours-complet'));
    enregistreRoute('/api/parcours/complet', ressourceParcoursComplet(configurationServeur));
    enregistreRoute('/mesures/:id', ressourcePagesJekyllConnectees(configurationServeur, 'mesures'));
  }

  enregistreRoute('/parcours', ressourceParcours(configurationServeur));

  enregistreRoute('/robots.txt', ressourceRobotsTxt(configurationServeur));
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
