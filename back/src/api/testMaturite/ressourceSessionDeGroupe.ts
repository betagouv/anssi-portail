import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourceSessionDeGroupe = ({entrepotSessionDeGroupe, middleware}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/:code', middleware.aseptise('code'), async (requete: Request, reponse: Response) => {

    const session =  await entrepotSessionDeGroupe.parCode(requete.params.code)
    reponse.sendStatus(session ? 200 : 404);
  });
  return routeur;
};
