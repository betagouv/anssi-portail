import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';

const ressourcePageCrisp = ({
  cmsCrisp,
  adaptateurEnvironnement,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/:id',
    middleware.aseptise('id'),
    async (requete: Request, reponse: Response) => {
      const idArticle = adaptateurEnvironnement
        .crisp()
        .idArticle(requete.params.id.toUpperCase());
      if (!idArticle) {
        reponse.sendStatus(404);
        return;
      }
      const pageHtmlCrisp = await cmsCrisp.recupereArticle(idArticle);
      const { titre, tableDesMatieres, description, contenu } = pageHtmlCrisp;
      reponse.send({ titre, description, contenu, tableDesMatieres });
    }
  );
  return routeur;
};

export { ressourcePageCrisp };
