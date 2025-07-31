import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express, { json, Request, Response } from 'express';
import { IpFilter } from 'express-ipfilter';
import rateLimit from 'express-rate-limit';
import { ConfigurationServeur } from './configurationServeur';
import { ressourceFavori } from './favoris/ressourceFavori';
import { ressourceFavoris } from './favoris/ressourceFavoris';
import { ressourceFavorisPartages } from './favoris/ressourceFavorisPartages';
import { fournisseurChemin } from './fournisseurChemin';
import { ressourceDemandesAide } from './mon-aide-cyber/ressourceDemandesAide';
import { ressourceApresAuthentificationOIDC } from './oidc/ressourceApresAuthentificationOIDC';
import { ressourceApresDeconnexionOIDC } from './oidc/ressourceApresDeconnexionOIDC';
import { ressourceConnexionOIDC } from './oidc/ressourceConnexionOIDC';
import { ressourceDeconnexionOIDC } from './oidc/ressourceDeconnexionOIDC';
import { ressourceAnnuaireDepartements } from './ressourceAnnuaireDepartements';
import { ressourceAnnuaireOrganisations } from './ressourceAnnuaireOrganisations';
import { ressourceAnnuaireRegions } from './ressourceAnnuaireRegions';
import { ressourceAnnuaireSecteursActivite } from './ressourceAnnuaireSecteursActivite';
import { ressourceAnnuaireTranchesEffectif } from './ressourceAnnuaireTranchesEffectif';
import { ressourceAvisUtilisateur } from './ressourceAvisUtilisateur';
import { ressourceContacts } from './ressourceContacts';
import { ressourceInformationsCreationCompte } from './ressourceInformationsCreationCompte';
import { ressourceInfosSite } from './ressourceInfosSite';
import { ressourcePageConnexion } from './ressourcePageConnexion';
import { ressourcePageCrisp } from './ressourcePageCrisp';
import { ressourcePageProduit } from './ressourcePageProduit';
import { ressourcePagesJekyll } from './ressourcePagesJekyll';
import { ressourcePagesJekyllConnectees } from './ressourcePagesJekyllConnectees';
import { ressourceProfil } from './ressourceProfil';
import { ressourceRetoursExperience } from './ressourceRetoursExperience';
import { ressourceStatistiques } from './ressourceStatistiques';
import { ressourceUtilisateurs } from './ressourceUtilisateurs';
import { ressourceDernierResultatDeTest } from './testMaturite/ressourceDernierResultatDeTest';
import { ressourceRepartitionDesResultatsDeTest } from './testMaturite/ressourceRepartitionDesResultatsDeTest';
import { ressourceResultatDeTest } from './testMaturite/ressourceResultatDeTest';
import { ressourceResultatsDeTest } from './testMaturite/ressourceResultatsDeTest';
import { ressourceResultatsSessionDeGroupe } from './testMaturite/ressourceResultatsSessionDeGroupe';
import { ressourceSessionDeGroupe } from './testMaturite/ressourceSessionDeGroupe';
import { ressourceSessionsDeGroupe } from './testMaturite/ressourceSessionsDeGroupe';

const creeServeur = (configurationServeur: ConfigurationServeur) => {
  const app = express();

  configurationServeur.adaptateurGestionErreur.initialise(app);

  app.use(configurationServeur.middleware.ajouteMethodeNonce);

  app.use(configurationServeur.middleware.positionneLesCsp());

  app.use(configurationServeur.middleware.interdisLaMiseEnCache);

  const limiteRequetesParMinute = rateLimit({
    windowMs: 60 * 1000,
    limit: configurationServeur.reseau.maxRequetesParMinutes,
  });
  app.set('trust proxy', configurationServeur.reseau.trustProxy);
  app.use(limiteRequetesParMinute);

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
      secret: process.env.SECRET_COOKIE,
      secure: process.env.NODE_ENV === 'production',
      signed: process.env.NODE_ENV === 'production',
    })
  );

  app.use(cookieParser());
  app.use(json());

  ['assets', 'scripts', 'lib-svelte', 'favicon.ico'].forEach((ressource) => {
    app.use(
      `/${ressource}`,
      express.static(fournisseurChemin.ressourceDeBase(ressource), {
        setHeaders: (reponse: Response) =>
          reponse.setHeader(
            'cache-control',
            process.env.CACHE_CONTROL_FICHIERS_STATIQUES || 'no-store'
          ),
      })
    );
  });

  app.use(configurationServeur.middleware.verifieModeMaintenance);

  [
    '',
    'catalogue',
    'parcours-debuter',
    'parcours-approfondir',
    'nis2',
    'test-maturite',
    'niveaux-maturite',
    'apres-authentification',
    'aPropos',
    'mentionsLegales',
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
  ].forEach((page) =>
    app.use(`/${page}`, ressourcePagesJekyll(configurationServeur, page))
  );

  app.use(
    '/favoris-partages/:id',
    ressourcePagesJekyll(configurationServeur, 'favoris-partages')
  );

  ['contacts', 'ma-maturite', 'favoris', 'services-anssi'].forEach((page) =>
    app.use(
      `/${page}`,
      ressourcePagesJekyllConnectees(configurationServeur, page)
    )
  );

  app.use('/connexion', ressourcePageConnexion(configurationServeur));

  ['services', 'ressources'].forEach((repertoireProduits) =>
    app.use(
      `/${repertoireProduits}`,
      ressourcePageProduit(configurationServeur, repertoireProduits)
    )
  );

  app.use('/oidc/connexion', ressourceConnexionOIDC(configurationServeur));

  app.use(
    '/oidc/apres-authentification',
    ressourceApresAuthentificationOIDC(configurationServeur)
  );

  app.use('/oidc/deconnexion', ressourceDeconnexionOIDC(configurationServeur));

  app.use('/oidc/apres-deconnexion', ressourceApresDeconnexionOIDC());

  app.use('/api/contacts', ressourceContacts(configurationServeur));

  app.use('/api/profil', ressourceProfil(configurationServeur));

  app.use('/api/utilisateurs', ressourceUtilisateurs(configurationServeur));

  app.use(
    '/api/mon-aide-cyber/demandes-aide',
    ressourceDemandesAide(configurationServeur)
  );

  app.use(
    '/api/favoris',
    ressourceFavoris(configurationServeur),
    ressourceFavori(configurationServeur)
  );

  app.use(
    '/api/favoris-partages',
    ressourceFavorisPartages(configurationServeur)
  );

  app.use(
    '/api/informations-creation-compte',
    ressourceInformationsCreationCompte(configurationServeur)
  );

  app.use(
    '/api/resultats-test',
    ressourceResultatsDeTest(configurationServeur),
    ressourceResultatDeTest(configurationServeur)
  );
  app.use(
    '/api/resultats-test/dernier',
    ressourceDernierResultatDeTest(configurationServeur)
  );

  app.use(
    '/api/sessions-groupe',
    ressourceSessionsDeGroupe(configurationServeur),
    ressourceSessionDeGroupe(configurationServeur),
    ressourceResultatsSessionDeGroupe(configurationServeur)
  );

  app.use(
    '/api/annuaire/organisations',
    ressourceAnnuaireOrganisations(configurationServeur)
  );

  app.use(
    '/api/annuaire/departements',
    ressourceAnnuaireDepartements(configurationServeur)
  );

  app.use(
    '/api/annuaire/regions',
    ressourceAnnuaireRegions(configurationServeur)
  );

  app.use(
    '/api/annuaire/secteurs-activite',
    ressourceAnnuaireSecteursActivite(configurationServeur)
  );

  app.use(
    '/api/annuaire/tranches-effectif',
    ressourceAnnuaireTranchesEffectif(configurationServeur)
  );

  app.use('/api/pages-crisp', ressourcePageCrisp(configurationServeur));

  app.use('/api/infos-site', ressourceInfosSite(configurationServeur));

  app.use(
    '/api/retours-experience',
    ressourceRetoursExperience(configurationServeur)
  );

  app.use('/api/statistiques', ressourceStatistiques(configurationServeur));

  app.use(configurationServeur.adaptateurGestionErreur.controleurErreurs);

  app.use(
    '/api/repartition-resultats-test',
    ressourceRepartitionDesResultatsDeTest(configurationServeur)
  );

  app.use(
    '/api/avis-utilisateur',
    ressourceAvisUtilisateur(configurationServeur)
  );

  app.use((_requete: Request, reponse: Response) => {
    reponse
      .status(404)
      .set('Content-Type', 'text/html')
      .sendFileAvecNonce(fournisseurChemin.ressourceDeBase('404.html'));
  });

  return app;
};
export { creeServeur };
