import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { TestExpositionRéalisé } from '../../../bus/evenements/TestExpositionRealise.js';
import { Utilisateur } from '../../../metier/utilisateur.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { valideCorpsRequete } from '../../zod.js';
import { schemaPostTestExposition } from './ressourceTestsExposition.schema.js';

export const ressourceTestsExposition = ({
  busEvenements,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
}: ConfigurationServeur) => {
  const routeur = Router();

  routeur.post(
    '/',
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(schemaPostTestExposition),
    async (requête, réponse) => {
      const { typeOrganisation, secteur, facteursAggravant } = requête.body;
      const utilisateur = requête.utilisateur as Utilisateur;

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
