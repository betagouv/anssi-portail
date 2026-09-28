import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

const DEUX_MINUTES = Temporal.Duration.from({ minutes: 2 });

const ressourceConnexionOIDC = (configurationServeur: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete, reponse) => {
      const demandeAutorisation = await configurationServeur.adaptateurOIDC.genereDemandeAutorisation();

      const { url, state, nonce } = demandeAutorisation;
      reponse.cookie(
        'AgentConnectInfo',
        { state, nonce },
        { httpOnly: true, secure: true, maxAge: DEUX_MINUTES.total('milliseconds'), sameSite: 'none' }
      );

      reponse.redirect(url);
    })
  );
  return routeur;
};

export { ressourceConnexionOIDC };
