import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { contactsParRegion } from '../metier/referentielContacts';
import { CodeDepartement, regionDuDepartement } from '../metier/referentielDepartements';

const ressourceContacts = ({
  middleware,
  adaptateurProfilAnssi,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    async (requete: Request, reponse: Response) => {
      const profilANSSI = await adaptateurProfilAnssi.recupere(
        requete.emailUtilisateurCourant!
      );
      if (!profilANSSI) {
        reponse.sendStatus(404);
        return;
      }

      const codeRegion = regionDuDepartement(profilANSSI.organisation.departement as CodeDepartement);
      
      reponse.json(contactsParRegion[codeRegion]);
    }
  );
  return routeur;
};

export { ressourceContacts };
