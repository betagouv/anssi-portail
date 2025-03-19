import { ConfigurationServeur } from './configurationServeur';
import { Router } from 'express';

const ressourceDernierResultatDeTest = ({
  entrepotResultatTest,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', middleware.verifieJWT, async (requete, reponse) => {
    const emailUtilisateur = requete.session?.email;
    const resultatTest =
      await entrepotResultatTest.dernierPourUtilisateur(emailUtilisateur);
    if (!resultatTest) {
      reponse.sendStatus(404);
      return;
    }
    reponse.send({ reponses: resultatTest.reponses });
  });
  return routeur;
};

export { ressourceDernierResultatDeTest };
