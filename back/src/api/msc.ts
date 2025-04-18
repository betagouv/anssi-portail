import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express, { json, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { IpFilter } from 'express-ipfilter';
import { ConfigurationServeur } from './configurationServeur';
import { fournisseurChemin } from './fournisseurChemin';
import { ressourceApresAuthentificationOIDC } from './oidc/ressourceApresAuthentificationOIDC';
import { ressourceApresDeconnexionOIDC } from './oidc/ressourceApresDeconnexionOIDC';
import { ressourceConnexionOIDC } from './oidc/ressourceConnexionOIDC';
import { ressourceDeconnexionOIDC } from './oidc/ressourceDeconnexionOIDC';
import { ressourcePageProduit } from './ressourcePageProduit';
import { ressourcePagesJekyll } from './ressourcePagesJekyll';
import { ressourceProfil } from './ressourceProfil';
import { ressourceResultatsDeTest } from './ressourceResultatsDeTest';
import { ressourceAnnuaireOrganisations } from './ressourceAnnuaireOrganisations';
import { ressourceAnnuaireDepartements } from './ressourceAnnuaireDepartements';
import { ressourceInformationsCreationCompte } from './ressourceInformationsCreationCompte';
import { ressourceUtilisateurs } from './ressourceUtilisateurs';
import { ressourcePageConnexion } from './ressourcePageConnexion';
import { ressourceAnnuaireRegions } from './ressourceAnnuaireRegions';
import { ressourceAnnuaireSecteursActivite } from './ressourceAnnuaireSecteursActivite';
import { ressourceAnnuaireTranchesEffectif } from './ressourceAnnuaireTranchesEffectif';
import { ressourceResultatDeTest } from './ressourceResultatDeTest';
import { ressourceContacts } from './ressourceContacts';
import { ressourceDernierResultatDeTest } from './ressourceDernierResultatDeTest';
import { ressourcePagesJekyllConnectees } from './ressourcePagesJekyllConnectees';
import { ressourceFavoris } from './ressourceFavoris';
import { ressourceFavori } from './ressourceFavori';
import { ressourceFavorisPartages } from './ressourceFavorisPartages';
import { ressourceDemandesAide } from './mon-aide-cyber/ressourceDemandesAide';

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

  app.use(configurationServeur.adaptateurGestionErreur.controleurErreurs);

  app.use((_requete: Request, reponse: Response) => {
    reponse
      .status(404)
      .set('Content-Type', 'text/html')
      .sendFileAvecNonce(fournisseurChemin.ressourceDeBase('404.html'));
  });

  return app;
};
export { creeServeur };
