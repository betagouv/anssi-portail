import { Router } from 'express';
import { HttpStatusCode } from '@anssi-portail/axios';
import { ProprieteTestRevendiquee } from '@bus/evenements/proprieteTestRevendiquee.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

const ressourceResultatDeTest = ({
  entrepôtRésultatTestMaturité,
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
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete, reponse) => {
      const resultatTest = await entrepôtRésultatTestMaturité.parId(requete.params.id as string);
      if (!resultatTest) {
        reponse.sendStatus(HttpStatusCode.NotFound);
        return;
      }

      const utilisateur = requete.utilisateur;

      if (resultatTest.utilisateur?.email && resultatTest.utilisateur?.email !== utilisateur.email) {
        reponse.sendStatus(HttpStatusCode.Forbidden);
        return;
      }
      if (resultatTest.utilisateur?.email === utilisateur.email) {
        reponse.sendStatus(HttpStatusCode.Ok);
        return;
      }

      await resultatTest.revendiquePropriete(utilisateur, adaptateurRechercheEntreprise);

      await entrepôtRésultatTestMaturité.metsÀjour(resultatTest);
      await busEvenements.publie(
        new ProprieteTestRevendiquee({
          utilisateur,
          idResultatTest: resultatTest.id,
        })
      );
      reponse.sendStatus(HttpStatusCode.Ok);
    })
  );
  return routeur;
};

export { ressourceResultatDeTest };
