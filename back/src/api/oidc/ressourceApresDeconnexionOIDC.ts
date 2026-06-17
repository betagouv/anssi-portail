import { Request, Response, Router } from 'express';
import { detruisSession } from '../session';
import { corpsVide, valideCorpsRequete } from '../zod';

export const ressourceApresDeconnexionOIDC = () => {
  const routes = Router();

  routes.get('/', valideCorpsRequete(corpsVide), async (requete: Request, reponse: Response) => {
    const { state } = requete.cookies.AgentConnectInfo;
    if (state !== requete.query.state) {
      reponse.sendStatus(401);
      return;
    }
    reponse.clearCookie('AgentConnectInfo');
    detruisSession(requete, reponse);
    reponse.redirect('/');
  });
  return routes;
};
