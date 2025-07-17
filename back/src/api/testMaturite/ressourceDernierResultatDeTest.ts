import { regionParCode } from '../../metier/referentielRegions';
import { secteurParCode } from '../../metier/referentielSecteurs';
import { trancheEffectifParCode } from '../../metier/referentielTranchesEffectifEtablissement';
import { ConfigurationServeur } from '../configurationServeur';
import { Router } from 'express';

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
      const { codeRegion, codeSecteur, codeTrancheEffectif } =
        resultatRechercheOrga[0];
      reponse.send({
        reponses: resultatTest.reponses,
        dateRealisation: resultatTest.dateRealisation,
        idNiveau: resultatTest.niveau(),
        organisation: {
          trancheEffectif: {
            code: codeTrancheEffectif,
            libelle: trancheEffectifParCode(codeTrancheEffectif).libelle,
          },
          secteur: {
            code: codeSecteur,
            libelle: secteurParCode(codeSecteur!).libelle,
          },
          region: {
            code: codeRegion,
            libelle: regionParCode(codeRegion!).nom,
          },
        },
      });
    }
  );
  return routeur;
};

export { ressourceDernierResultatDeTest };
