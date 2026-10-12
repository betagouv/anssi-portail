import { HttpStatusCode, isAxiosError } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { ID_CRISP_KIT_RELAIS } from '../metier/pageCrisp.js';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const ressourcePageCrisp = ({ cmsCrisp }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/kit-relais',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (_requete: Request, reponse: Response) => {
      try {
        const pageHtmlCrisp = await cmsCrisp.recupereArticle(ID_CRISP_KIT_RELAIS);
        const { titre, tableDesMatieres, description, contenu } = pageHtmlCrisp;
        reponse.send({ titre, description, contenu, tableDesMatieres });
      } catch (e) {
        if (isAxiosError(e) && e.response?.status === HttpStatusCode.NotFound) {
          return reponse.sendStatus(HttpStatusCode.NotFound);
        }
        throw e;
      }
    })
  );
  return routeur;
};

export { ressourcePageCrisp };
