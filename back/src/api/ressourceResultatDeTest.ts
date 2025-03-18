import { ConfigurationServeur } from './configurationServeur';
import { Router } from 'express';
import { ProprieteTestRevendiquee } from '../bus/proprieteTestRevendiquee';

const ressourceResultatDeTest = ({
  entrepotResultatTest,
  busEvenements,
  middleware
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.put('/:id', middleware.  async (requete, reponse) => {
    const resultatTest = await entrepotResultatTest.parId(requete.params.id);
    if (!resultatTest) {
      reponse.sendStatus(404);
      return;
    }
    const emailUtilisateur = requete.session?.email;
    resultatTest.emailUtilisateur = emailUtilisateur;
    await entrepotResultatTest.metsAjour(resultatTest);
    await busEvenements.publie(
      new ProprieteTestRevendiquee({
        emailUtilisateur,
        idResultatTest: resultatTest.id,
      })
    );
    reponse.sendStatus(200);
  });
  return routeur;
};

export { ressourceResultatDeTest };
