import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';

const ressourcePageCrisp = ({ cmsCrisp, adaptateurEnvironnement }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:id',
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const idArticle = adaptateurEnvironnement.crisp().idArticle((requete.params.id as string).toUpperCase());
      if (!idArticle) {
        reponse.sendStatus(404);
        return;
      }
      const pageHtmlCrisp = await cmsCrisp.recupereArticle(idArticle);
      const { titre, tableDesMatieres, description, contenu } = pageHtmlCrisp;
      reponse.send({ titre, description, contenu, tableDesMatieres });
    })
  );
  return routeur;
};

export { ressourcePageCrisp };
