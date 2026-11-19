import { HttpStatusCode } from '@anssi-portail/axios';
import { Router } from 'express';
import { ResultatRechercheEntreprise } from '../../../infra/adaptateurRechercheEntreprise.js';
import { ResultatTestMaturite } from '../../../metier/mini-tests/maturite-cyber/resultatTestMaturite.js';
import { CodeRégion, estCodeRegion, regionParCode } from '../../../metier/referentielRegions.js';
import { Secteur, secteurParCode } from '../../../metier/referentielSecteurs.js';
import { TrancheEffectif, trancheEffectifParCode } from '../../../metier/referentielTranchesEffectifEtablissement.js';
import { ConfigurationServeur } from '../../configurationServeur.js';
import { filetRouteAsynchrone } from '../../middlewares/middleware.js';
import { corpsVide, valideCorpsRequete } from '../../zod.js';

type PrésentationOrganisation = {
  region?: {
    libelle: string;
    code: CodeRégion;
  };
  secteur?: Secteur;
  trancheEffectif?: TrancheEffectif;
};

const présentationOrganisation = (
  résulatTest: ResultatTestMaturite,
  résultatRechercheOrganisation?: ResultatRechercheEntreprise
): PrésentationOrganisation | undefined => {
  const codeTrancheEffectif = résultatRechercheOrganisation?.codeTrancheEffectif ?? résulatTest.tailleOrganisation;
  const codeRegion = résultatRechercheOrganisation?.codeRegion ?? résulatTest.region;
  const codeSecteur = résultatRechercheOrganisation?.codeSecteur ?? résulatTest.secteur;

  const trancheEffectif = codeTrancheEffectif ? trancheEffectifParCode(codeTrancheEffectif) : undefined;
  const region = estCodeRegion(codeRegion)
    ? {
        code: codeRegion,
        libelle: regionParCode(codeRegion).nom,
      }
    : undefined;

  const secteur = secteurParCode(codeSecteur);

  if (!region && !trancheEffectif && !secteur) {
    return undefined;
  }

  return {
    region,
    secteur,
    trancheEffectif,
  };
};

const ressourceDernierResultatDeTest = ({
  entrepôtRésultatTestMaturité,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  adaptateurRechercheEntreprise,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(entrepotUtilisateur, adaptateurHachage),
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(async (requete, reponse) => {
      const resultatTest = await entrepôtRésultatTestMaturité.dernierPourUtilisateur(requete.utilisateur);
      if (!resultatTest) {
        reponse.sendStatus(HttpStatusCode.NotFound);
        return;
      }

      const resultatRechercheOrga = await adaptateurRechercheEntreprise.rechercheOrganisation(
        requete.utilisateur.siretEntite,
        null
      );

      reponse.send({
        reponses: resultatTest.reponses,
        dateRealisation: resultatTest.dateRealisation,
        idNiveau: resultatTest.niveau(),
        organisation: présentationOrganisation(resultatTest, resultatRechercheOrga),
      });
    })
  );
  return routeur;
};

export { ressourceDernierResultatDeTest };
