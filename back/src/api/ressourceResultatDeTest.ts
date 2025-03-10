import { ConfigurationServeur } from './configurationServeur';
import { Router } from 'express';
import { TestRealise } from '../bus/testRealise';

const ressourceResultatDeTest = ({
  busEvenement,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    middleware.aseptise('region', 'secteur', 'tailleOrganisation', "reponses.*"),
    async (requete, reponse) => {
      await busEvenement.publie(
        new TestRealise({
          region: requete.body.region,
          secteur: requete.body.secteur,
          tailleOrganisation: requete.body.tailleOrganisation,
          reponses: requete.body.reponses,
        })
      );
      reponse.sendStatus(201);
    }
  );
  return routeur;
};

export { ressourceResultatDeTest };
