import compression from 'compression';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express, { json, NextFunction, Request, Response } from 'express';
import { IpFilter } from 'express-ipfilter';
import rateLimit from 'express-rate-limit';
import { ConfigurationServeur } from './configurationServeur.js';
import { erreurPageInterdite, erreurPageNonTrouvée, ErreurTraverséeDeChemin } from './erreurs.js';
import { ressourceFavori } from './favoris/ressourceFavori.js';
import { ressourceFavoris } from './favoris/ressourceFavoris.js';
import { ressourceFavorisPartages } from './favoris/ressourceFavorisPartages.js';
import { FichierInconnu } from './fournisseurChemin.js';
import { ressourceDocumentGuide } from './guides/ressourceDocumentGuide.js';
import { ressourceDocumentsGuide } from './guides/ressourceDocumentsGuide.js';
import { ressourceGuide } from './guides/ressourceGuide.js';
import { ressourceGuides } from './guides/ressourceGuides.js';
import { ressourceGuidesMemesCollections } from './guides/ressourceGuidesMemesCollections.js';
import { ressourceAvisMesure } from './mesures/ressourceAvisMesure.js';
import { ressourceMesure } from './mesures/ressourceMesure.js';
import { ressourceModule } from './mesures/ressourceModule.js';
import { ressourceParcoursComplet } from './mesures/ressourceParcoursComplet.js';
import { ressourcePriseEnCompte } from './mesures/ressourcePriseEnCompte.js';
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
import { ressourcePageCrisp } from './ressourcePageCrisp.js';
import { ressourcePageProduit } from './ressourcePageProduit.js';
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

  const brancheLesRessourcesStatiques = (avecCors: boolean) => (ressource: string) => {
    const sertLesFichiersStatiques = express.static(fournisseurChemin.ressourceDeBase(ressource), {
      setHeaders: (reponse: Response) =>
        reponse.setHeader('cache-control', process.env.CACHE_CONTROL_FICHIERS_STATIQUES || 'no-store'),
    });

    if (avecCors) {
      app.use(`/${ressource}`, cors(), sertLesFichiersStatiques);
    } else {
      app.use(`/${ressource}`, sertLesFichiersStatiques);
    }
  };

  brancheLesRessourcesStatiques(true)('assets');
  ['scripts', 'lib-svelte', 'favicon.ico'].forEach(brancheLesRessourcesStatiques(false));

  app.use(configurationServeur.middleware.verifieModeMaintenance);

  app.use('/financements', (requete, reponse) => {
    const id = requete.query.idFinancement;
    if (Object.keys(requete.query).length > 0 && id) {
      // on garde la redirection pour ne pas casser les liens existants
      return reponse.redirect(301, `/financements/${id}`);
    }
    reponse
      .contentType('text/html')
      .status(200)
      .envoieFichierEnrichi(fournisseurChemin.cheminPageJekyll('financements'));
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
    .forEach((page) => app.use(`/${page}`, ressourcePagesJekyll(configurationServeur, page)));

  app.use('/financements/:id', ressourcePagesJekyll(configurationServeur, 'financements'));

  app.use('/favoris-partages/:id', ressourcePagesJekyll(configurationServeur, 'favoris-partages'));

  app.use('/guides/:slug', ressourcePagesJekyll(configurationServeur, 'guides'));

  ['ma-maturite', 'favoris', 'services-anssi', 'gestion-guides'].forEach((page) =>
    app.use(`/${page}`, ressourcePagesJekyllConnectees(configurationServeur, page))
  );

  app.use('/connexion', ressourcePageConnexion(configurationServeur));

  ['services', 'ressources', 'contacts'].forEach((repertoireProduits) =>
    app.use(`/${repertoireProduits}`, ressourcePageProduit(configurationServeur, repertoireProduits))
  );

  app.use('/oidc/connexion', ressourceConnexionOIDC(configurationServeur));

  app.use('/oidc/apres-authentification', ressourceApresAuthentificationOIDC(configurationServeur));

  app.use('/oidc/deconnexion', ressourceDeconnexionOIDC(configurationServeur));

  app.use('/oidc/apres-deconnexion', ressourceApresDeconnexionOIDC());

  app.use('/api', limiteRequetesParMinuteAPI);

  app.use('/api/profil', ressourceProfil(configurationServeur));

  app.use('/api/utilisateurs', ressourceUtilisateurs(configurationServeur));

  app.use('/api/mon-aide-cyber/demandes-aide', ressourceDemandesAide(configurationServeur));

  app.use('/api/favoris', ressourceFavoris(configurationServeur), ressourceFavori(configurationServeur));

  app.use('/api/favoris-partages', ressourceFavorisPartages(configurationServeur));

  app.use('/api/informations-creation-compte', ressourceInformationsCreationCompte(configurationServeur));

  app.use(
    '/api/resultats-test',
    ressourceResultatsDeTest(configurationServeur),
    ressourceResultatDeTest(configurationServeur)
  );
  app.use('/api/resultats-test/dernier', ressourceDernierResultatDeTest(configurationServeur));

  app.use(
    '/api/sessions-groupe',
    ressourceSessionsDeGroupe(configurationServeur),
    ressourceSessionDeGroupe(configurationServeur),
    ressourceResultatsSessionDeGroupe(configurationServeur)
  );

  app.use('/api/annuaire/organisations', ressourceAnnuaireOrganisations(configurationServeur));

  app.use('/api/annuaire/departements', ressourceAnnuaireDepartements(configurationServeur));

  app.use('/api/annuaire/regions', ressourceAnnuaireRegions(configurationServeur));

  app.use('/api/annuaire/secteurs-activite', ressourceAnnuaireSecteursActivite(configurationServeur));

  app.use('/api/annuaire/tranches-effectif', ressourceAnnuaireTranchesEffectif(configurationServeur));

  app.use('/api/pages-crisp', ressourcePageCrisp(configurationServeur));

  app.use('/api/infos-site', ressourceInfosSite(configurationServeur));

  app.use('/api/retours-experience', ressourceRetoursExperience(configurationServeur));

  app.use('/api/statistiques', ressourceStatistiques(configurationServeur));

  app.use('/api/repartition-resultats-test', ressourceRepartitionDesResultatsDeTest(configurationServeur));

  app.use('/api/avis-utilisateur', ressourceAvisUtilisateur(configurationServeur));

  app.use('/api/financements', ressourceFinancements(configurationServeur), ressourceFinancement(configurationServeur));

  app.use(
    '/api/guides',
    ressourceGuides(configurationServeur),
    ressourceGuide(configurationServeur),
    ressourceGuidesMemesCollections(configurationServeur),
    ressourceDocumentsGuide(configurationServeur)
  );

  app.use('/documents-guides', ressourceDocumentGuide(configurationServeur));
  app.use('/documents-ressources', ressourceDocumentRessource(configurationServeur));

  app.use('/visas/tl-fr.sha2', ressourceControleContenuListeConfiance());
  app.use('/visas', ressourceVisa(configurationServeur));

  app.use('/api/diagnostic/statistiques', ressourceStatistiquesDiagnostic());

  app.use('/api/exigences-nis2', ressourceExigencesNis2(configurationServeur));
  app.use('/api/exigences-nis2.csv', ressourceExigencesNis2Csv(configurationServeur));

  if (configurationServeur.adaptateurEnvironnement.fonctionnalites().nis2().afficheSimulateur())
    app.use('/api/simulateur-nis2', ressourceSimulateurNis2(configurationServeur));

  app.use('/api/sante-guides', ressourceSanteGuides(configurationServeur));

  app.use('/api/abonnement-infolettre', ressourceAbonnementInfolettre(configurationServeur));

  const parcoursActive = configurationServeur.adaptateurEnvironnement
    .fonctionnalites()
    .parcoursDeSecurisation()
    .estActif();
  if (parcoursActive) {
    app.use(
      '/api/mesures',
      ressourceMesure(configurationServeur),
      ressourceAvisMesure(configurationServeur),
      ressourcePriseEnCompte(configurationServeur)
    );
    app.use('/api/modules', ressourceModule(configurationServeur));
    app.use('/module-cyberdepart', ressourcePagesJekyllConnectees(configurationServeur, 'module-cyberdepart'));
    app.use('/parcours-complet', ressourcePagesJekyllConnectees(configurationServeur, 'parcours-complet'));
    app.use('/mesures/:id', ressourcePagesJekyllConnectees(configurationServeur, 'mesures'));
  }

  app.use('/api/parcours/complet', ressourceParcoursComplet());

  [
    ['/directive-nis2', '/nis2'],
    ['/aPropos', '/a-propos'],
    ['/mentionsLegales', '/mentions-legales'],
    ['/a-propos/', '/a-propos'],
    ['/abonnement-infolettre/', 'abonnement-infolettre'],
    ['/accessibilite/', '/accessibilite'],
    ['/apres-authentification/', '/apres-authentification'],
    ['/associations/', '/associations'],
    ['/catalogue/', '/catalogue'],
    ['/cgu/', '/cgu'],
    ['/collectivites/', '/collectivites'],
    ['/confidentialite/', '/confidentialite'],
    ['/confirmation-abonnement-infolettre/', '/confirmation-abonnement-infolettre'],
    ['/connexion/', '/connexion'],
    ['/contacts/', '/contacts'],
    ['/creation-compte/', '/creation-compte'],
    ['/demande-aide-mon-aide-cyber/', '/demande-aide-mon-aide-cyber'],
    ['/entreprises/', '/entreprises'],
    ['/favoris-partages/', '/favoris-partages'],
    ['/favoris/', '/favoris'],
    ['/financements/', '/financements'],
    ['/inscription/', '/inscription'],
    ['/ma-maturite/', '/ma-maturite'],
    ['/maintenance/', '/maintenance'],
    ['/mentions-legales/', '/mentions-legales'],
    ['/module-cyberdepart/', '/module-cyberdepart'],
    ['/nis2/', '/nis2'],
    ['/niveaux-maturite/', '/niveaux-maturite'],
    ['/parcours-approfondir/', '/parcours-approfondir'],
    ['/parcours-debuter/', '/parcours-debuter'],
    ['/prestataires/', '/prestataires'],
    ['/promouvoir-diagnostic-cyber/', '/promouvoir-diagnostic-cyber'],
    ['/promouvoir-msc/', '/promouvoir-msc'],
    ['/resultats-session-groupe/', '/resultats-session-groupe'],
    ['/sante/', '/sante'],
    ['/securite/', '/securite'],
    ['/services-anssi/', '/services-anssi'],
    ['/session-groupe/', '/session-groupe'],
    ['/simulateur-nis2/', '/simulateur-nis2'],
    ['/statistiques/', '/statistiques'],
    ['/test-maturite/', '/test-maturite'],
  ].forEach(([precedent, nouveau]: string[]) => {
    app.use(precedent, (_requete: Request, reponse: Response) => {
      reponse.redirect(301, nouveau);
    });
  });

  app.use('/robots.txt', ressourceRobotsTxt(configurationServeur));
  app.use('/sitemap.xml', ressourceSitemapXml(routesStatiques, configurationServeur));

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
