import cors from 'cors';
import { Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { filetRouteAsynchrone } from './middleware';
import { schemaRessourceAnnuaireOrganisations } from './ressourceAnnuaireOrganisations.schema';
import { valideRequete } from './zod';

const ressourceAnnuaireOrganisations = ({ adaptateurRechercheEntreprise }: ConfigurationServeur): Router => {
  const routeur = Router();
  routeur.get(
    '/',
    cors(),
    valideRequete(schemaRessourceAnnuaireOrganisations),
    filetRouteAsynchrone(async (requete, reponse) => {
      const recherche = requete.query.recherche ? requete.query.recherche.toString() : '';
      const departement = requete.query.departement ? requete.query.departement.toString() : null;
      const suggestions = await adaptateurRechercheEntreprise.rechercheOrganisations(recherche, departement);
      reponse.status(200).json({ suggestions });
    })
  );
  return routeur;
};
export { ressourceAnnuaireOrganisations };
