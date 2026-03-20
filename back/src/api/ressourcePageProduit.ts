import { HttpStatusCode } from 'axios';
import { ConfigurationServeur } from './configurationServeur';
import { Request, Response, Router } from 'express';

const ressourcePageProduit = (
  { fournisseurChemin, middleware }: ConfigurationServeur,
  repertoireProduits: string
): Router => {
  const routeur = Router();

  routeur.get('/:id', middleware.aseptise('id'), (requete: Request, reponse: Response) => {
    if (requete.params.id === 'mon-espace-nis2.html') {
      return reponse.redirect(HttpStatusCode.MovedPermanently, '/nis2');
    }
    console.log(requete.params.id);
    reponse
      .contentType('text/html')
      .status(200)
      .sendFileAvecNonce(fournisseurChemin.cheminProduitJekyll(repertoireProduits, requete.params.id as string));
  });

  return routeur;
};
export { ressourcePageProduit };
