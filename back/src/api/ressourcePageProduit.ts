import { HttpStatusCode } from 'axios';
import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { corpsVide, valideCorpsRequete } from './zod';
import { PathTraversalError } from './erreurs';

const ressourcePageProduit = ({ fournisseurChemin }: ConfigurationServeur, repertoireProduits: string): Router => {
  const routeur = Router();

  routeur.get('/:id', valideCorpsRequete(corpsVide), (requete: Request, reponse: Response) => {
    if (requete.params.id === 'mon-espace-nis2.html') {
      return reponse.redirect(HttpStatusCode.MovedPermanently, '/nis2');
    }
    try {
      reponse
        .contentType('text/html')
        .status(200)
        .envoieFichierEnrichi(fournisseurChemin.cheminProduitJekyll(repertoireProduits, requete.params.id as string));
    } catch (err) {
      if (err instanceof PathTraversalError) {
        return reponse.status(403).json({ erreur: 'Accès refusé' });
      }
      throw err;
    }
  });

  return routeur;
};
export { ressourcePageProduit };
