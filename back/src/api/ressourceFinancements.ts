import { Request, Response, Router } from 'express';

import { HttpStatusCode } from '@anssi-portail/axios';

import { Financement } from '@metier/financement.js';
import { estCodeRegion } from '@metier/referentielRegions.js';
import { trancheEffectifParCode } from '@metier/referentielTranchesEffectifEtablissement.js';

import { ConfigurationServeur } from './configurationServeur.js';
import { filetRouteAsynchrone } from './middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from './zod.js';

const construitFiltreFinancementParRegion = (codeRegion?: string) => {
  if (!estCodeRegion(codeRegion)) {
    return () => true;
  }
  return (financement: Financement): boolean =>
    financement.régions.includes('FRANCE') || financement.régions.includes(codeRegion);
};

const construitFiltreFinancementParEntite = ({
  estAssociation,
  estCollectivite,
  codeTrancheEffectif,
}: {
  estAssociation: boolean;
  estCollectivite: boolean;
  codeTrancheEffectif?: string;
}) => {
  if (estCollectivite) {
    return (financement: Financement): boolean => financement.entitésÉligibles.includes('Collectivités');
  }
  if (estAssociation) {
    return (financement: Financement): boolean => financement.entitésÉligibles.includes('Associations');
  }
  const trancheEffectif = trancheEffectifParCode(codeTrancheEffectif);
  if (trancheEffectif.code !== 'NN') {
    const codeEffectifNombre = Number(trancheEffectif.code);
    if (codeEffectifNombre < 12) {
      return (financement: Financement): boolean => financement.entitésÉligibles.includes('TPE');
    }
    if (codeEffectifNombre < 32) {
      return (financement: Financement): boolean => financement.entitésÉligibles.includes('PME');
    }
    if (codeEffectifNombre < 52) {
      return (financement: Financement): boolean => financement.entitésÉligibles.includes('ETI');
    }
    return (financement: Financement): boolean => financement.entitésÉligibles.includes('Entreprises');
  }
  return () => true;
};

export const ressourceFinancements = ({
  entrepotFinancement,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  adaptateurRechercheEntreprise,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete: Request, reponse: Response) => {
      try {
        let financements = await entrepotFinancement.tous();

        if (requete.utilisateur) {
          const resultatRechercheOrga = await adaptateurRechercheEntreprise.rechercheOrganisation(
            requete.utilisateur.siretEntite,
            null
          );

          if (resultatRechercheOrga) {
            const { codeRegion, codeTrancheEffectif, estCollectivite, estAssociation } = resultatRechercheOrga;

            financements = financements
              .filter(
                construitFiltreFinancementParEntite({
                  estAssociation,
                  estCollectivite,
                  codeTrancheEffectif,
                })
              )
              .filter(construitFiltreFinancementParRegion(codeRegion));
          }
        }
        reponse.send(
          financements.map((financement) => ({
            id: financement.id,
            nom: financement.nom,
            financeur: financement.financeur,
            typesDeFinancement: financement.typesDeFinancement,
            entitésÉligibles: financement.entitésÉligibles,
            périmètresGéographiques: financement.périmètresGéographiques,
            régions: financement.régions,
          }))
        );
      } catch {
        reponse.sendStatus(HttpStatusCode.InternalServerError);
      }
    })
  );
  return routeur;
};
