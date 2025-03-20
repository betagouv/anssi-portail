import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';
import { check } from 'express-validator';

const ressourceFavoris = ({
  middleware,
  entrepotFavori,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/',
    middleware.verifieJWT,
    middleware.aseptise('id'),
    [check('id').not().isEmpty().withMessage("L'id est invalide")],
    middleware.valide(),
    async (requete: Request, reponse: Response) => {
      let id = requete.body.id;
      id = id.replaceAll('&#x2F;', '/');
      await entrepotFavori.ajoute({
        id,
        emailUtilisateur: requete.session?.email,
      });
      reponse.sendStatus(201);
    }
  );

  routeur.get(
    '/',
    middleware.verifieJWT,
    async (requete: Request, reponse: Response) => {
      const favoris = await entrepotFavori.tousCeuxDeUtilisateur(
        requete.session?.email
      );
      reponse.status(200).send(favoris.map((favori) => favori.id));
    }
  );

  return routeur;
};

export { ressourceFavoris };
