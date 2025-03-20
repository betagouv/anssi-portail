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
  return routeur;
};

export { ressourceFavoris };
