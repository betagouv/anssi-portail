import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { contactsParRegion } from '../metier/referentielContacts';
import {
  CodeDepartement,
  regionDuDepartement,
} from '../metier/referentielDepartements';

const ressourceContacts = ({
  middleware,
  entrepotUtilisateur,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur),
    async (requete: Request, reponse: Response) => {
      const utilisateur = requete.utilisateur;

      if (!utilisateur) {
        reponse.sendStatus(404);
        return;
      }

      const codeRegion = regionDuDepartement(
        (await utilisateur.organisation()).departement as CodeDepartement
      );

      reponse.json(contactsParRegion[codeRegion]);
    }
  );
  return routeur;
};

export { ressourceContacts };
