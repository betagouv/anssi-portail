import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import express, { json, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { ConfigurationServeur } from './configurationServeur';
import { fournisseurChemin } from './fournisseurChemin';
import { ressourceApresAuthentificationOIDC } from './oidc/ressourceApresAuthentificationOIDC';
import { ressourceApresDeconnexionOIDC } from './oidc/ressourceApresDeconnexionOIDC';
import { ressourceConnexionOIDC } from './oidc/ressourceConnexionOIDC';
import { ressourceDeconnexionOIDC } from './oidc/ressourceDeconnexionOIDC';
import { ressourcePageProduit } from './ressourcePageProduit';
import { ressourcePagesJekyll } from './ressourcePagesJekyll';
import { ressourceProfil } from './ressourceProfil';
import { ressourceResultatDeTest } from './ressourceResultatDeTest';
import {ressourceAnnuaireOrganisations} from "./ressourceAnnuaireOrganisations";
import {ressourceAnnuaireDepartements} from "./ressourceAnnuaireDepartements";
import { ressourceInformationsCreationCompte } from './ressourceInformationsCreationCompte';
import { ressourceUtilisateurs } from './ressourceUtilisateurs';

const creeServeur = (configurationServeur: ConfigurationServeur) => {
  const app = express();

  configurationServeur.adaptateurGestionErreur.initialise(app);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        scriptSrc: ["'self'", 'https://stats.beta.gouv.fr', 'https://browser.sentry-cdn.com'],
        connectSrc: ["'self'", 'https://stats.beta.gouv.fr'],
        mediaSrc: ["'self'", 'https://monservicesecurise-ressources.cellar-c2.services.clever-cloud.com']
      }
    }
  }));
  app.use(configurationServeur.middleware.interdisLaMiseEnCache);

  const centParMinute = rateLimit({
    windowMs: 60 * 1000,
    limit: configurationServeur.maxRequetesParMinutes,
  });
  app.set('trust proxy', configurationServeur.trustProxy);
  app.use(centParMinute);

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
    'connexion',
    'apres-authentification',
    'aPropos',
    'mentionsLegales',
    'confidentialite',
    'cgu',
    'accessibilite',
    'creation-compte',
  ].forEach((page) =>
    app.use(`/${page}`, ressourcePagesJekyll(configurationServeur, page))
  );

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

  app.use(
    '/oidc/apres-deconnexion',
    ressourceApresDeconnexionOIDC(configurationServeur)
  );

  app.use('/api/profil', ressourceProfil());

  app.use('/api/utilisateurs', ressourceUtilisateurs(configurationServeur));

  app.use('/api/informations-creation-compte', ressourceInformationsCreationCompte(configurationServeur));

  app.use('/api/resultats-test', ressourceResultatDeTest(configurationServeur));
  
  app.use('/api/annuaire/organisations', ressourceAnnuaireOrganisations(configurationServeur));

  app.use('/api/annuaire/departements', ressourceAnnuaireDepartements(configurationServeur));

  app.use(configurationServeur.adaptateurGestionErreur.controleurErreurs);

  app.use((_requete: Request, reponse: Response) => {
    reponse
      .status(404)
      .set('Content-Type', 'text/html')
      .sendFile(fournisseurChemin.ressourceDeBase('404.html'));
  });

  return app;
};
export { creeServeur };
