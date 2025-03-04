import express, { Request, Response } from 'express';
import { ressourcePagesJekyll } from './ressourcePagesJekyll';
import rateLimit from 'express-rate-limit';
import { ConfigurationServeur } from './configurationServeur';
import { ressourcePageProduit } from './ressourcePageProduit';
import { fournisseurChemin } from './fournisseurChemin';
import { ressourceConnexionOIDC } from './oidc/ressourceConnexionOIDC';
import { ressourceApresAuthentificationOIDC } from './oidc/ressourceApresAuthentificationOIDC';
import cookieSession from 'cookie-session';
import cookieParser from 'cookie-parser';
import { ressourceProfil } from './ressourceProfil';

const creeServeur = (configurationServeur: ConfigurationServeur) => {
  const app = express();

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
      express.static(fournisseurChemin.ressourceDeBase(ressource))
    );
  });

  app.use('/oidc/connexion', ressourceConnexionOIDC(configurationServeur));

  app.use(
    '/oidc/apres-authentification',
    ressourceApresAuthentificationOIDC(configurationServeur)
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
