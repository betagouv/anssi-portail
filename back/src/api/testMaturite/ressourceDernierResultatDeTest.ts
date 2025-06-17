import { ConfigurationServeur } from '../configurationServeur';
import { Router } from 'express';

const ressourceDernierResultatDeTest = ({
  entrepotResultatTest,
  middleware,
  entrepotUtilisateur
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get('/', middleware.verifieJWT, middleware.ajouteUtilisateurARequete(entrepotUtilisateur), async (requete, reponse) => {
    const resultatTest = await entrepotResultatTest.dernierPourUtilisateur(
      requete.utilisateur
    );
    if (!resultatTest) {
      reponse.sendStatus(404);
      return;
    }
    reponse.send({ reponses: resultatTest.reponses });
  });
  return routeur;
};

export { ressourceDernierResultatDeTest };
