import { Request, Response, Router } from 'express';
import { estCodeRegion } from '../../metier/referentielRegions';
import { estCodeSecteur } from '../../metier/referentielSecteurs';
import { trancheEffectifParCode } from '../../metier/referentielTranchesEffectifEtablissement';
import { RepartitionResultatsTest } from '../../metier/repartitionResultatsTest';
import { ConfigurationServeur } from '../configurationServeur';

export const ressourceRepartitionDesResultatsDeTest = ({
  entrepotResultatTest,
  adaptateurEnvironnement,
  middleware,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.aseptise('secteur', 'tailleOrganisation', 'region'),
    async (
      requete: Request<
        unknown,
        unknown,
        unknown,
        { secteur?: string; tailleOrganisation?: string; region?: string }
      >,
      reponse: Response
    ) => {
      const codeSecteur = estCodeSecteur(requete.query.secteur)
        ? requete.query.secteur
        : undefined;
      const codeRegion = estCodeRegion(requete.query.region)
        ? requete.query.region
        : undefined;
      const tailleOrganisation = trancheEffectifParCode(
        requete.query.tailleOrganisation
      );
      const tousLesResultats =
        await entrepotResultatTest.parFiltresEnOmettantUtilisateur({
          codeSecteur,
          codeRegion,
          codeTrancheEffectif:
            tailleOrganisation.code !== 'NN'
              ? tailleOrganisation.code
              : undefined,
        });
      if (
        tousLesResultats.length <
        adaptateurEnvironnement.repartition().nombreMinimumDeResultats()
      ) {
        reponse.sendStatus(204);
        return;
      }
      const repartitions = new RepartitionResultatsTest(
        tousLesResultats
      ).calculeRepartitionParNiveau();
      reponse.send(repartitions);
    }
  );

  return routeur;
};
