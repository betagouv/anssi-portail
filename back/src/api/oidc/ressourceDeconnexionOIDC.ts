import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

const TRENTE_SECONDES = Temporal.Duration.from({ seconds: 30 });

export const ressourceDeconnexionOIDC = (configurationServeur: ConfigurationServeur) => {
  const routes = Router();

  routes.get('/', valideCorpsRequete(corpsVide), async (requete, reponse) => {
    const { url, state } = await configurationServeur.adaptateurOIDC.genereDemandeDeconnexion(
      requete.session!.AgentConnectIdToken
    );

    reponse.cookie(
      'AgentConnectInfo',
      { state },
      {
        maxAge: TRENTE_SECONDES.total('milliseconds'),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }
    );

    reponse.redirect(url);
  });
  return routes;
};
