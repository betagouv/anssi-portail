import { Request, Response, Router } from 'express';
import { estCodeRegion } from '../../metier/referentielRegions.js';
import { estCodeSecteur } from '../../metier/referentielSecteurs.js';
import { trancheEffectifParCode } from '../../metier/referentielTranchesEffectifEtablissement.js';
import { RepartitionResultatsTest } from '../../metier/repartitionResultatsTest.js';
import { ConfigurationServeur } from '../configurationServeur.js';
import { filetRouteAsynchrone } from '../middleware.js';
import { corpsVide, valideCorpsRequete } from '../zod.js';

export const ressourceRepartitionDesResultatsDeTest = ({
  entrepotResultatTest,
  adaptateurEnvironnement,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    valideCorpsRequete(corpsVide),
    filetRouteAsynchrone(
      async (
        requete: Request<unknown, unknown, unknown, { secteur?: string; tailleOrganisation?: string; region?: string }>,
        reponse: Response
      ) => {
        const codeSecteur = estCodeSecteur(requete.query.secteur) ? requete.query.secteur : undefined;
        const codeRegion = estCodeRegion(requete.query.region) ? requete.query.region : undefined;
        const tailleOrganisation = trancheEffectifParCode(requete.query.tailleOrganisation);
        const codeTrancheEffectif = tailleOrganisation.code !== 'NN' ? tailleOrganisation.code : undefined;
        const tousLesResultats = await entrepotResultatTest.parFiltresEnOmettantUtilisateur({
          codeSecteur,
          codeRegion,
          codeTrancheEffectif,
        });
        if (tousLesResultats.length < adaptateurEnvironnement.repartition().nombreMinimumDeResultats()) {
          reponse.sendStatus(204);
          return;
        }
        const repartitions = new RepartitionResultatsTest(tousLesResultats).calculeRepartitionParNiveau();
        reponse.send(repartitions);
      }
    )
  );

  return routeur;
};
