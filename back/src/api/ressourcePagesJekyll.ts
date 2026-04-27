import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { corpsVide, valideCorpsRequete } from './zod';

const ressourcePagesJekyll = ({ fournisseurChemin }: ConfigurationServeur, nomPage: string): Router => {
  const routeur = Router();

  routeur.get('/', valideCorpsRequete(corpsVide), (_requete: Request, reponse: Response) => {
    reponse.contentType('text/html').status(200).envoieFichierEnrichi(fournisseurChemin.cheminPageJekyll(nomPage));
  });

  return routeur;
};
export { ressourcePagesJekyll };
