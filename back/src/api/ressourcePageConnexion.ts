import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { detruisSession } from './session';
import { corpsVide, valideCorpsRequete } from './zod';

const ressourcePageConnexion = ({ fournisseurChemin }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get('/', valideCorpsRequete(corpsVide), (requete: Request, reponse: Response) => {
    detruisSession(requete, reponse);
    reponse.contentType('text/html').status(200).envoieFichierEnrichi(fournisseurChemin.cheminPageJekyll('connexion'));
  });

  return routeur;
};
export { ressourcePageConnexion };
