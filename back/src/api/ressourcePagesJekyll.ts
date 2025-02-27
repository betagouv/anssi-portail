import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourcePagesJekyll = (
  { fournisseurChemin }: ConfigurationServeur,
  nomPage: string
): Router => {
  const routeur = Router();

  routeur.get('/', (_requete: Request, reponse: Response) => {
    reponse
      .contentType('text/html')
      .status(200)
      .sendFile(fournisseurChemin.cheminPageJekyll(nomPage));
  });

  return routeur;
};
export { ressourcePagesJekyll };
