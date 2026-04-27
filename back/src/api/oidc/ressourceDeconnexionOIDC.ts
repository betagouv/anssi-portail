import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import { corpsVide, valideCorpsRequete } from '../zod';

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
        maxAge: 30_000,
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      }
    );

    reponse.redirect(url);
  });
  return routes;
};
