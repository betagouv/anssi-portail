import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import helmet from 'helmet';
import express, { Request, Response } from 'express';
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

const creeServeur = (configurationServeur: ConfigurationServeur) => {
  const app = express();

  app.use(helmet());
  app.use(configurationServeur.middleware.interdisLaMiseEnCache);

  const centParMinute = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    skip: (req) => req.url.startsWith('/assets'),
  });
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
          reponse.setHeader('cache-control', process.env.CACHE_CONTROL_FICHIERS_STATIQUES || 'no-store'),
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

  app.use('/profil', ressourceProfil(configurationServeur));

  app.use((_requete: Request, reponse: Response) => {
    reponse
      .status(404)
      .set('Content-Type', 'text/html')
      .sendFile(fournisseurChemin.ressourceDeBase('404.html'));
  });

  return app;
};
export { creeServeur };
