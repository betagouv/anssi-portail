import {ConfigurationServeur} from './configurationServeur';
import {Router} from 'express';

const ressourceAnnuaireOrganisations = (
  {middleware, adaptateurRechercheEntreprise}: ConfigurationServeur
): Router => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.aseptise('recherche', 'departement'),
    async (requete, reponse) => {
      const recherche = requete.query.recherche ? requete.query.recherche.toString() : '';
      const departement = requete.query.departement ? requete.query.departement.toString() : null;
      if (recherche === '') {
        reponse.status(400).send('Le terme de recherche ne peut pas être vide');
        return;
      }

      const suggestions = await adaptateurRechercheEntreprise.rechercheOrganisations(recherche, departement)
      reponse.status(200).json({suggestions});
    }
  );
  return routeur;
};
export {ressourceAnnuaireOrganisations};
