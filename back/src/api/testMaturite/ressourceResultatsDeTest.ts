import { Request, Response, Router } from 'express';
import z from 'zod';
import { ProprieteTestRevendiquee } from '../../bus/evenements/proprieteTestRevendiquee';
import { TestRealise } from '../../bus/evenements/testRealise';
import { ResultatTestMaturite } from '../../metier/resultatTestMaturite';
import { ConfigurationServeur } from '../configurationServeur';
import { filetRouteAsynchrone } from '../middleware';
import { corpsVide, valideCorpsRequete } from '../zod';
import { schemaRessourceResultatsDeTest } from './ressourceResultatsDeTest.schema';
import CorpsDeRequeteTypee = Express.CorpsDeRequeteTypee;

const ressourceResultatsDeTest = ({
  busEvenements,
  middleware,
  entrepotResultatTest,
  entrepotUtilisateur,
  adaptateurHachage,
  adaptateurRechercheEntreprise,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.post(
    '/',
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(schemaRessourceResultatsDeTest),
    filetRouteAsynchrone(
      async (requete: CorpsDeRequeteTypee<z.infer<typeof schemaRessourceResultatsDeTest>>, reponse: Response) => {
        const { tailleOrganisation, region, secteur, reponses, codeSessionGroupe } = requete.body;

        const utilisateur = requete.utilisateur;
        const resultatTest = new ResultatTestMaturite({
          tailleOrganisation: tailleOrganisation ?? undefined,
          region: region ?? undefined,
          secteur: secteur ?? undefined,
          reponses,
          codeSessionGroupe,
        });
        if (utilisateur) {
          await resultatTest.revendiquePropriete(utilisateur, adaptateurRechercheEntreprise);
        }

        await entrepotResultatTest.ajoute(resultatTest);

        await busEvenements.publie(
          new TestRealise({
            region: resultatTest.region,
            secteur: resultatTest.secteur,
            tailleOrganisation: resultatTest.tailleOrganisation,
            reponses,
            codeSessionGroupe,
            idResultatTest: resultatTest.id,
          })
        );
        if (utilisateur) {
          await busEvenements.publie(
            new ProprieteTestRevendiquee({
              idResultatTest: resultatTest.id,
              utilisateur,
            })
          );
        }

        reponse.status(201).send({ id: resultatTest.id });
      }
    )
  );
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      const resultatsDeTest = await entrepotResultatTest.pourUtilisateur(requete.utilisateur);

      reponse.send(
        resultatsDeTest.map((resultat) => ({
          id: resultat.id,
          niveau: resultat.niveau(),
          dateRealisation: resultat.dateRealisation,
          reponses: resultat.reponses,
        }))
      );
    })
  );
  return routeur;
};

export { ressourceResultatsDeTest };
