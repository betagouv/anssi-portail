import { Router } from 'express';
import { ConfigurationServeur } from '../configurationServeur';

const ressourceDemandesAide = ({
  adaptateurMonAideCyber,
}: ConfigurationServeur): Router => {
  const routeur = Router();

  routeur.post('/', async (requete, reponse) => {
    await adaptateurMonAideCyber.creeDemandeAide({ email: requete.body.email });
    reponse.sendStatus(201);
  });
  return routeur;
};

export { ressourceDemandesAide };
