import { Router } from 'express';
import { regionParCode } from '../../metier/referentielRegions';
import { secteurParCode } from '../../metier/referentielSecteurs';
import { trancheEffectifParCode } from '../../metier/referentielTranchesEffectifEtablissement';
import { ConfigurationServeur } from '../configurationServeur';

const ressourceDernierResultatDeTest = ({
  entrepotResultatTest,
  middleware,
  entrepotUtilisateur,
  adaptateurHachage,
  adaptateurRechercheEntreprise,
}: ConfigurationServeur) => {
  const routeur = Router();
  routeur.get(
    '/',
    middleware.verifieJWT,
    middleware.ajouteUtilisateurARequete(
      entrepotUtilisateur,
      adaptateurHachage
    ),
    async (requete, reponse) => {
      const resultatTest = await entrepotResultatTest.dernierPourUtilisateur(
        requete.utilisateur
      );
      if (!resultatTest) {
        reponse.sendStatus(404);
        return;
      }

      const resultatRechercheOrga =
        await adaptateurRechercheEntreprise.rechercheOrganisations(
          requete.utilisateur.siretEntite,
          null
        );
      const {
        codeRegion = resultatTest.region,
        codeSecteur = resultatTest.secteur,
        codeTrancheEffectif = resultatTest.tailleOrganisation,
      } = resultatRechercheOrga[0];

      const trancheEffectif = codeTrancheEffectif
        ? {
            code: codeTrancheEffectif,
            libelle: trancheEffectifParCode(codeTrancheEffectif).libelle,
          }
        : undefined;

      const region = codeRegion
        ? {
            code: codeRegion,
            libelle: regionParCode(codeRegion).nom,
          }
        : undefined;

      const secteur = codeSecteur
        ? {
            code: codeSecteur,
            libelle: secteurParCode(codeSecteur).libelle,
          }
        : undefined;

      reponse.send({
        reponses: resultatTest.reponses,
        dateRealisation: resultatTest.dateRealisation,
        idNiveau: resultatTest.niveau(),
        organisation: {
          trancheEffectif,
          secteur,
          region,
        },
      });
    }
  );
  return routeur;
};

export { ressourceDernierResultatDeTest };
