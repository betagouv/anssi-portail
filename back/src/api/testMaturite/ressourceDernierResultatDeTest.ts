import { ConfigurationServeur } from '../configurationServeur';
import { Router } from 'express';

const ressourceDernierResultatDeTest = ({
  entrepotResultatTest,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(
      entrepotUtilisateur,
      adaptateurHachage
    ),
    async (requete, reponse) => {
      const resultatTest = await entrepotResultatTest.dernierPourUtilisateur(
        requete.utilisateur
      );
      if (!resultatTest) {
        reponse.sendStatus(404);
        return;
      }
      reponse.send({
        reponses: resultatTest.reponses,
        dateRealisation: resultatTest.dateRealisation,
        idNiveau: resultatTest.niveau(),
      });
    }
  );
  return routeur;
};

export { ressourceDernierResultatDeTest };
