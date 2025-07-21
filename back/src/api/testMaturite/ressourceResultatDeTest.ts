import { Router } from 'express';
import { ProprieteTestRevendiquee } from '../../bus/evenements/proprieteTestRevendiquee';
import { ConfigurationServeur } from '../configurationServeur';

const ressourceResultatDeTest = ({
  entrepotResultatTest,
  busEvenements,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  adaptateurRechercheEntreprise,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.put(
    '/:id',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(
      entrepotUtilisateur,
      adaptateurHachage
    ),
    async (requete, reponse) => {
      const resultatTest = await entrepotResultatTest.parId(requete.params.id);
      if (!resultatTest) {
        reponse.sendStatus(404);
        return;
      }

      const utilisateur = requete.utilisateur;

      if (
        resultatTest.utilisateur?.email &&
        resultatTest.utilisateur?.email !== utilisateur.email
      ) {
        reponse.sendStatus(403);
        return;
      }
      if (resultatTest.utilisateur?.email === utilisateur.email) {
        reponse.sendStatus(200);
        return;
      }

      await resultatTest.revendiquePropriete(
        utilisateur,
        adaptateurRechercheEntreprise
      );

      await entrepotResultatTest.metsAjour(resultatTest);
      await busEvenements.publie(
        new ProprieteTestRevendiquee({
          utilisateur,
          idResultatTest: resultatTest.id,
        })
      );
      reponse.sendStatus(200);
    }
  );
  return routeur;
};

export { ressourceResultatDeTest };
