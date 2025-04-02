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
    async (requete: Request, reponse: Response) => {
      const utilisateur = await entrepotUtilisateur.parEmail(
        requete.emailUtilisateurCourant!
      );

      if (!utilisateur) {
        reponse.sendStatus(404);
        return;
      }

      const codeRegion = regionDuDepartement(
        utilisateur.organisation.departement as CodeDepartement
      );

      reponse.json(contactsParRegion[codeRegion]);
    }
  );
  return routeur;
};

export { ressourceContacts };
