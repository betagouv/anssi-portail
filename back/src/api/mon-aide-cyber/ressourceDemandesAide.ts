import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

export type CorpsDemandeAide = {
  email: string;
  emailAidant?: string;
  entite: {
    departement: string;
    raisonSociale: string;
  };
};

const ressourceDemandesAide = ({
  adaptateurMonAideCyber,
  middleware,
}: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.post(
    '/',
    middleware.aseptise(
      'email',
      'emailAidant',
      'entite.departement',
      'entite.raisonSociale'
    ),
    async (requete: CorpsDeRequeteTypee<CorpsDemandeAide>, reponse) => {
      await adaptateurMonAideCyber.creeDemandeAide({
        email: requete.body.email,
        ...(requete.body.emailAidant && {
          emailAidant: requete.body.emailAidant,
        }),
        departement: requete.body.entite.departement,
        raisonSociale: requete.body.entite.raisonSociale,
      });
      reponse.sendStatus(201);
    }
  );
  return routeur;
};

export { ressourceDemandesAide };
