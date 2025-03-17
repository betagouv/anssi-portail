import {ConfigurationServeur} from './configurationServeur';
import {Router} from 'express';
import { CodeDepartement, estCodeDepartement } from '../metier/referentielDepartements';

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
      if (departement !== null && !estCodeDepartement(departement as CodeDepartement)) {
        reponse.status(400).send('Le département doit être valide (01 à 989)');
        return;
      }

      const suggestions = await adaptateurRechercheEntreprise.rechercheOrganisations(recherche, departement)
      reponse.status(200).json({suggestions});
    }
  );
  return routeur;
};
export {ressourceAnnuaireOrganisations};
