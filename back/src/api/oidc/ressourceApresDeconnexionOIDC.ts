import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourceApresDeconnexionOIDC = (
  configurationServeur: ConfigurationServeur
) => {
  const routes = Router();

  routes.get('/', async (requete, reponse) => {
    const { state } = requete.cookies.AgentConnectInfo;
    if (state !== requete.query.state) {
      reponse.sendStatus(401);
      return;
    }
    reponse.clearCookie('AgentConnectInfo');
    reponse.redirect('/');
  });
  return routes;
};
