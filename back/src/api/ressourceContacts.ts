import { Request, Response, Router } from 'express';
import { ConfigurationServeur } from './configurationServeur';
import { regionDuDepartement } from '../metier/referentielRegions';

const ressourceContacts = ({ middleware, adaptateurProfilAnssi }: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', middleware.verifieJWT, async (requete: Request, reponse: Response) => {
    const profilANSSI = await adaptateurProfilAnssi.recupere(requete.emailUtilisateurCourant!);
    if(!profilANSSI) {
      reponse.sendStatus(404);
      return;
    }

    const region = regionDuDepartement(profilANSSI.organisation.departement);
    reponse.sendStatus(200);
  });
  return routeur;
};

export { ressourceContacts };
