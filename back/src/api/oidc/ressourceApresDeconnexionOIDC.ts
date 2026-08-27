import { HttpStatusCode } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { detruisSession } from '../session.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceApresDeconnexionOIDC = () => {
  const routes = Router();

  routes.get('/', valideCorpsRequete(corpsVide), async (requete: Request, reponse: Response) => {
    const { state } = requete.cookies.AgentConnectInfo;
    if (state !== requete.query.state) {
      reponse.sendStatus(HttpStatusCode.Unauthorized);
      return;
    }
    reponse.clearCookie('AgentConnectInfo');
    detruisSession(requete, reponse);
    reponse.redirect('/');
  });
  return routes;
};
