import { HttpStatusCode } from 'axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';

const ressourcePageProduit = ({ fournisseurChemin }: ConfigurationServeur, repertoireProduits: string): Router => {
  const routeur = Router();

  routeur.get('/:id', (requete: Request, reponse: Response) => {
    if (requete.params.id === 'mon-espace-nis2.html') {
      return reponse.redirect(HttpStatusCode.MovedPermanently, '/nis2');
    }
    reponse
      .contentType('text/html')
      .status(200)
      .envoieFichierEnrichi(fournisseurChemin.cheminProduitJekyll(repertoireProduits, requete.params.id as string));
  });

  return routeur;
};
export { ressourcePageProduit };
