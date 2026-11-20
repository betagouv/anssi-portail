import { HttpStatusCode } from '@anssi-portail/axios';
import cors from 'cors';
import { Router } from 'express';
import { TestExpositionRéalisé } from '../../../bus/evenements/TestExpositionRealise.js';
import { RésultatTestExposition } from '../../../metier/mini-tests/exposition/resultatTestExposition.js';
import { Utilisateur } from '../../../metier/utilisateur.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { valideCorpsRequete } from '../../zod.js';
import { schemaPostTestExposition } from './ressourceTestsExposition.schema.js';

export const ressourceTestsExposition = ({
  busEvenements,
  middleware,
  entrepotUtilisateur,
  entrepôtRésultatTestExposition,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.options('/', cors());
  routeur.post(
    '/',
    cors(),
    valideCorpsRequete(schemaPostTestExposition),
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    async (requête, réponse) => {
      const { typeOrganisation, secteur, facteursAggravant } = requête.body;
      const utilisateur = requête.utilisateur as Utilisateur;

      if (utilisateur) {
        await entrepôtRésultatTestExposition.ajoute(new RésultatTestExposition({ utilisateur }));
      }

      await busEvenements.publie(
        new TestExpositionRéalisé(
          typeOrganisation,
          secteur,
          facteursAggravant,
          utilisateur?.email,
          await utilisateur?.codeRegion(),
          await utilisateur?.codeSecteur(),
          await utilisateur?.codeTrancheEffectif()
        )
      );
      réponse.sendStatus(HttpStatusCode.Created);
    }
  );

  return routeur;
};
