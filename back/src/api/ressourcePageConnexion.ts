import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourcePageConnexion = ({ fournisseurChemin }: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.get('/', (_requete: Request, reponse: Response) => {
    reponse.clearCookie('session');

    reponse.contentType('text/html').status(200).envoieFichierEnrichi(fournisseurChemin.cheminPageJekyll('connexion'));
  });

  return routeur;
};
export { ressourcePageConnexion };
