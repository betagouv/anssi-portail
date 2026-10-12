import { HttpStatusCode, isAxiosError } from '@anssi-portail/axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const CORRESPONDANCE_ID_CRISP: Record<string, string> = {
  'kit-relais': '9d295bcd-88ba-4f8a-99d5-61fdc788032d',
};

const ressourcePageCrisp = ({ cmsCrisp }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:slug',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const slug = requete.params.slug as string;

      const idPageCrisp = CORRESPONDANCE_ID_CRISP[slug];

      if (!idPageCrisp) {
        return reponse.sendStatus(HttpStatusCode.NotFound);
      }

      try {
        const pageHtmlCrisp = await cmsCrisp.recupereArticle(idPageCrisp);
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
