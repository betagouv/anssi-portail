import { Router } from 'express';

export const ressourceApresDeconnexionOIDC = () => {
  const routes = Router();

  routes.get('/', async (requete, reponse) => {
    const { state } = requete.cookies.AgentConnectInfo;
    if (state !== requete.query.state) {
      reponse.sendStatus(401);
      return;
    }
    reponse.clearCookie('AgentConnectInfo');
    reponse.clearCookie('session');
    reponse.redirect('/');
  });
  return routes;
};
